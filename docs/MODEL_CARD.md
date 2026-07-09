# Model Card and Limitations

## Artifact

- File: `models/stunting_pipeline.joblib`
- Runtime: scikit-learn pipeline
- Required compatibility: `scikit-learn==1.6.1`
- Inputs: 18 maternal, pregnancy, household, access, and condition fields

## Intended use

The model is presented as a **screening and prioritisation signal**. It is not a diagnosis and should not independently determine treatment, referral, or public-health intervention.

## Evidence not bundled in the source repository

The provided source does not include sufficient reproducible evidence for clinical-performance claims, including:

- held-out test metrics;
- external validation;
- calibration analysis;
- subgroup and fairness evaluation;
- prospective clinical validation;
- deployment drift monitoring.

Therefore the UI intentionally does not claim a specific accuracy, AUC, sensitivity, specificity, or clinical validity.

## Required verification

Before real-world deployment:

1. reconstruct and version the training dataset;
2. reproduce preprocessing and training;
3. evaluate on a held-out test set;
4. assess probability calibration;
5. evaluate relevant demographic and regional subgroups;
6. perform external validation;
7. define human review and escalation workflows;
8. monitor drift and data quality after deployment.

## LLM limitation

Gemini 2.5 Flash-Lite only rewrites aggregated evidence produced by the local engine. It must not be treated as the source of numeric truth. If the LLM is unavailable, deterministic evidence remains the fallback.
