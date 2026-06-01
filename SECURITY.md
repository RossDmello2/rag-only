# Security Policy

## Supported Versions

The `main` branch is the supported development line.

## Reporting a Vulnerability

Use GitHub private vulnerability reporting for `RossDmello2/rag-only` when the repository is published. Do not open a public issue for suspected secrets, credential exposure, or exploitable parsing behavior.

If private vulnerability reporting is not enabled yet, contact the maintainer through the GitHub repository owner profile and include a minimal reproduction, affected browser/runtime version, and impact. Do not include real secrets or private documents.

Expected response target: maintainer acknowledgment within 7 days after the report is received.

## Security Boundaries

- This is a static browser app.
- It does not provide authentication, authorization, a backend proxy, or secret storage.
- Local Ollama and Qdrant endpoints should be bound to trusted interfaces only.
- Cloud LLM provider keys are not supported in the production UI.
- The app parses user-selected local files in the browser and rejects files larger than 25 MB.

## Deployment Guidance

Do not expose this static app as a public multi-user service without adding authentication, server-side request validation, provider-key isolation, and Qdrant access control.
