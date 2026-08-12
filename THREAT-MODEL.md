# Threat Model

## Scope

This model covers the local browser interface, the Node.js server in this repository, and its connection to the OpenAI Image API. It does not claim to secure a public multi-user deployment.

## Assets

- OpenAI API key and available API credit
- User prompts and generated images
- The integrity of application code and dependencies
- The user's local machine and browser session

## Trust Boundaries

1. Browser to local Node.js server
2. Local Node.js server to OpenAI over HTTPS
3. Environment variables and repository code to the running process
4. Optional deployment infrastructure outside this repository

## Threats and Mitigations

| Threat | Current mitigation | Residual risk |
|---|---|---|
| API key exposed to the browser or repository | Key is read server-side; `.env` and key files are ignored | Screenshots, shell history, host compromise, or an accidental commit can still expose it |
| Sensitive prompt sent without user awareness | The interface discloses the OpenAI transfer next to the prompt | A user may still submit sensitive data; OpenAI is an external processor |
| Prompt or image retained by the application | No application database or browser storage; API responses use `no-store`; clear action removes page references | Runtime memory is not securely erased; external infrastructure may log or cache |
| Prompt disclosed through an export | Export actions require an explicit click; filenames never contain prompt text; the interface warns that receipts include the full prompt | Downloaded files and clipboard contents are managed by the operating system and survive page clearing |
| Cross-site scripting from prompts or API data | Content is assigned through safe DOM properties; inline scripts are blocked by CSP | A browser, dependency, or future rendering change may introduce new risk |
| Malformed or oversized input | Strict JSON parser, 4 KB request limit, and prompt validation | Resource exhaustion remains possible under sustained local or public traffic |
| Unexpected API spending | Five requests per 15 minutes per client identifier | In-memory limiting resets on restart and is unsuitable for distributed public deployment |
| Unintended network exposure | Server binds to `127.0.0.1` by default | Changing `HOST`, a local proxy, malware, or host misconfiguration can expand access |
| Dependency or supply-chain compromise | Lockfile, automated tests, and dependency audit workflow | Audits do not detect every malicious or unknown vulnerability |
| Upstream service failure or invalid response | Generic client errors and validation of returned base64 data | OpenAI availability, policy, and data handling remain outside project control |

## Security Assumptions

- The local operating system, browser, Node.js runtime, and user account are trusted.
- The OpenAI endpoint and TLS validation provided by the runtime are trusted.
- The user protects the `.env` file and does not install untrusted browser extensions or dependencies.
- The user controls access to downloaded files, screenshots, and operating-system clipboard history.

## Out of Scope for the Local Reference App

- Multi-user authentication and authorization
- Public hosting hardening and distributed rate limiting
- Protection against a fully compromised local machine
- Guaranteed deletion from OpenAI or third-party infrastructure
- Content moderation or legal review of generated images

Revisit this model before adding accounts, persistence, telemetry, another model provider, file uploads, or public hosting.
