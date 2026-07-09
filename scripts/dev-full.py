from __future__ import annotations

import importlib.util
import os
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run_checked(command: list[str]) -> None:
    completed = subprocess.run(command, cwd=ROOT, check=False)
    if completed.returncode != 0:
        raise SystemExit(completed.returncode)


def main() -> int:
    missing = [name for name in ('fastapi', 'uvicorn', 'pandas', 'joblib', 'sklearn') if importlib.util.find_spec(name) is None]
    if missing:
        print('\n[StuntLytics] Python data-science dependencies are missing:', ', '.join(missing))
        print('[StuntLytics] Install them first with: python -m pip install -r requirements.txt\n')
        return 2

    node = 'node.exe' if os.name == 'nt' else 'node'
    npm = 'npm.cmd' if os.name == 'nt' else 'npm'
    run_checked([node, 'scripts/cleanup-legacy-routes.mjs'])
    run_checked([node, 'scripts/validate-routes.mjs'])

    env = os.environ.copy()
    commands = [
        [sys.executable, '-m', 'uvicorn', 'ds_api.main:app', '--reload', '--host', '127.0.0.1', '--port', '8000'],
        [npm, 'run', 'dev:web'],
    ]
    processes: list[subprocess.Popen] = []

    print('[StuntLytics] Starting integrated workspace:')
    print('  Web UI          http://127.0.0.1:3000')
    print('  Data Science API http://127.0.0.1:8000/docs')

    try:
        for command in commands:
            processes.append(subprocess.Popen(command, cwd=ROOT, env=env))
        while True:
            for process in processes:
                code = process.poll()
                if code is not None:
                    return code
            time.sleep(0.5)
    except KeyboardInterrupt:
        return 0
    finally:
        for process in processes:
            if process.poll() is None:
                if os.name == 'nt':
                    process.terminate()
                else:
                    process.send_signal(signal.SIGTERM)
        for process in processes:
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()


if __name__ == '__main__':
    raise SystemExit(main())
