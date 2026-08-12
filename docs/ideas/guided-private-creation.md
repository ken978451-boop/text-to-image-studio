# Guided Private Creation

## Problem Statement

How might Text to Image Studio help people who are unfamiliar with prompting create a useful image, understand where their data goes, and keep a reproducible result without adding accounts, tracking, or persistent application storage?

## Recommended Direction

Evolve the application into a privacy-first guided image workspace. People may continue to write a prompt directly or open an optional builder for subject, scene, lighting, style, and composition. The builder runs entirely in the browser; only the final prompt is sent to OpenAI after the user selects **Generate**.

After generation, the application provides the PNG, a copyable prompt, and a plain-text privacy receipt that explains the external data flow and the application's retention boundary.

## Key Assumptions to Validate

- [ ] New users can create their first prompt without reading the README.
- [ ] An optional builder reduces uncertainty without slowing down experienced users.
- [ ] People value keeping the prompt alongside the image for reproducibility.
- [ ] A compact privacy receipt improves understanding instead of distracting from creation.

## MVP Scope

- Collapsible prompt builder with a free-form subject and no more than five presets in each supporting category.
- Browser-only prompt composition with an editable final prompt.
- PNG download with a timestamped filename that does not expose the prompt.
- Copy-prompt action.
- Visible and downloadable plain-text privacy receipt.
- Clear action that removes the prompt, image, builder values, and receipt from the current page.
- Automated behavior tests and real-browser verification at responsive breakpoints.

## Success Criteria

- The builder, direct prompt path, generation path, exports, receipt, and clear action work with keyboard navigation.
- The interface states that the final prompt is sent to OpenAI and that this application does not persist it.
- No cookies, analytics, database, `localStorage`, `sessionStorage`, or IndexedDB are introduced.
- Generated filenames contain only a neutral prefix and timestamp.
- The full test suite, dependency audit, secret scan, and browser checks pass.

## Not Doing

- Cloud history, user accounts, or a public gallery because they require persistent user data.
- A second AI call to improve prompts because it adds cost and another data-transfer step.
- ZIP packaging because separate downloads are sufficient for the MVP.
- Prompt text in filenames or image metadata because it can disclose user input unexpectedly.
- A mandatory wizard because it would add friction for experienced users.
- A local image model because installation and hardware requirements are outside this phase.

## Product Defaults

- The prompt builder is collapsed by default.
- The subject is free-form; scene, lighting, style, and composition use small preset lists.
- The privacy receipt is available on screen and as a `.txt` file.
- The interface remains in Traditional Chinese; repository documentation remains in English.
- All feature state is page-memory only and disappears on reload or clear.

## Open Questions for User Testing

- Which builder categories produce the clearest improvement for first-time users?
- Do users understand that a downloaded receipt contains their full prompt?
- Is copying the prompt more valuable than downloading the receipt?
