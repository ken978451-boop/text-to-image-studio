# Security Policy

## Supported Version

This is a small reference project. Security fixes are applied to the latest commit on the `main` branch; older commits and forks are not supported.

## Reporting a Vulnerability

Please use GitHub's private vulnerability reporting flow for this repository:

[Report a vulnerability privately](https://github.com/ken978451-boop/text-to-image-studio/security/advisories/new)

Include the affected commit, reproduction steps, impact, and any suggested mitigation. Do not include a live API key, private prompt, or generated image.

If private reporting is unavailable, open a public issue that asks the maintainer to establish a private contact channel, but do not publish exploit details or secrets in that issue. As a solo-maintained reference project, response and fix times cannot be guaranteed.

## Exposed Credentials

If an OpenAI API key is exposed, revoke it immediately in the OpenAI dashboard and create a replacement. Removing it from the latest file or commit does not make the old key safe.

## Deployment Scope

The default configuration binds to `127.0.0.1` and is intended for local use. Internet-facing deployment requires a separate review of authentication, HTTPS, proxy trust, persistent rate limiting, abuse prevention, logging, monitoring, and secret management.
