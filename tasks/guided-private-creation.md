# Guided Private Creation Implementation

## Slice 1: Browser-only data helpers

- [x] Test and implement prompt composition.
- [x] Test and implement neutral timestamped filenames.
- [x] Test and implement the plain-text privacy receipt.

## Slice 2: Optional prompt builder

- [x] Add accessible builder controls and local-only disclosure.
- [x] Apply the composed prompt without unexpected overwrites.
- [x] Verify direct prompt entry remains unchanged.

## Slice 3: Receipt and exports

- [x] Display the privacy receipt after a successful generation.
- [x] Add PNG download, prompt copy, and receipt download actions.
- [x] Clear prompt, builder, image, and receipt state together.

## Completion Gate

- [ ] Update English project documentation.
- [ ] Run the full test suite and dependency audit.
- [ ] Test the complete workflow in a real browser at 320px, 768px, 1024px, and 1440px.
- [ ] Review correctness, readability, architecture, security, and performance.
- [ ] Scan for secrets and confirm the branch is clean after publishing.
