from __future__ import annotations

import os
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional


DEFAULT_MODEL = "gemini-2.5-flash-lite"
OFFICIAL_INPUT_LIMIT = 1_048_576
OFFICIAL_OUTPUT_LIMIT = 65_536


def _env_int(name: str, default: int, minimum: int, maximum: int) -> int:
    try:
        value = int(os.getenv(name, str(default)))
    except (TypeError, ValueError):
        value = default
    return max(minimum, min(maximum, value))


def _env_float(name: str, default: float, minimum: float, maximum: float) -> float:
    try:
        value = float(os.getenv(name, str(default)))
    except (TypeError, ValueError):
        value = default
    return max(minimum, min(maximum, value))


@dataclass
class LLMResult:
    text: Optional[str]
    mode: str
    error: Optional[str] = None


class GeminiFreeTierNarrative:
    """Optional Gemini narrative layer with deterministic evidence fallback.

    Only aggregated evidence is sent to the LLM. Raw health records and the
    serialized model input rows are intentionally not forwarded.
    """

    def __init__(self) -> None:
        self.provider = "google_gemini"
        self.model = os.getenv("GEMINI_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.max_output_tokens = _env_int(
            "GEMINI_MAX_OUTPUT_TOKENS",
            default=4096,
            minimum=256,
            maximum=OFFICIAL_OUTPUT_LIMIT,
        )
        self.temperature = _env_float("GEMINI_TEMPERATURE", 0.25, 0.0, 1.0)
        self.retries = _env_int("GEMINI_RETRIES", 1, 0, 2)

    def status(self) -> Dict[str, Any]:
        return {
            "provider": self.provider,
            "model": self.model,
            "configured": bool(self.api_key),
            "fallback": "deterministic_evidence",
            "inputTokenLimit": OFFICIAL_INPUT_LIMIT,
            "outputTokenLimit": OFFICIAL_OUTPUT_LIMIT,
            "configuredMaxOutputTokens": self.max_output_tokens,
            "dataBoundary": "aggregated_evidence_only",
            "freeTierNote": "Free-tier eligibility and quotas depend on the Google AI account/project.",
        }

    def generate(self, question: str, evidence_markdown: str) -> LLMResult:
        if not self.api_key:
            return LLMResult(text=None, mode="deterministic_evidence")

        system_instruction = (
            "Anda adalah asisten analitik kesehatan masyarakat untuk StuntLytics. "
            "Jawab dalam Bahasa Indonesia yang ringkas, jelas, dan profesional. "
            "Gunakan hanya bukti agregat yang diberikan. Jangan membuat diagnosis, "
            "jangan menganggap korelasi sebagai kausalitas, jangan mengarang angka, "
            "dan pertahankan setiap angka persis seperti sumber. Bedakan observasi, "
            "interpretasi, dan saran verifikasi. Gunakan Markdown sederhana tanpa tabel."
        )
        prompt = (
            "Pertanyaan pengguna:\n"
            f"{question.strip()}\n\n"
            "Bukti agregat terverifikasi dari engine StuntLytics:\n"
            f"{evidence_markdown}\n\n"
            "Susun jawaban dengan maksimal empat bagian: Ringkasan, Bukti utama, "
            "Hal yang perlu diverifikasi, dan Langkah berikutnya."
        )

        last_error: Optional[str] = None
        for attempt in range(self.retries + 1):
            try:
                from google import genai
                from google.genai import types

                client = genai.Client(api_key=self.api_key)
                response = client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=self.temperature,
                        top_p=0.9,
                        max_output_tokens=self.max_output_tokens,
                    ),
                )
                text = getattr(response, "text", None)
                if text and text.strip():
                    return LLMResult(text=text.strip(), mode="gemini_free_tier_grounded")
                last_error = "Gemini returned an empty response."
            except Exception as exc:  # SDK exceptions vary across releases.
                last_error = str(exc)[:500]
                if attempt < self.retries and any(code in last_error for code in ("429", "503", "RESOURCE_EXHAUSTED")):
                    time.sleep(1.5 * (attempt + 1))
                    continue
                break

        return LLMResult(text=None, mode="deterministic_evidence", error=last_error)


LLM = GeminiFreeTierNarrative()
