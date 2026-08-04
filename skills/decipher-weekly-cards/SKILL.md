---
name: decipher-weekly-cards
description: Generate privacy-safe Decipher weekly Instagram card/news PNG sets with stable weekly, speaker, and interview conventions; exact metadata handling; faithful Korean interview copy; mixed-aspect photo layout; and 1080x1350 export verification. Use when Codex creates or revises Decipher card-news images from a local photo folder and free-form notes.
---

# Decipher Weekly Cards

Create Decipher Instagram cards from local photos and Korean notes without retaining week-specific personal inputs in the reusable skill or repository.

## Required References

Read these before generating:

- `references/week1-style.md` for the visual baseline.
- `references/editorial-and-layout.md` for metadata, tags, text fidelity, crop, and blank-card rules.
- `references/input-contract.md` when converting notes into renderer data.
- `references/privacy-and-publishing.md` before staging, committing, or pushing reusable changes.

Prior-week outputs are optional sanity checks. The references above contain the default decision criteria, so generation must not depend on locating old cards.

## Decision Precedence

Resolve conflicts in this order:

1. The user's latest explicit correction.
2. The current request's notes and photos.
3. The reusable conventions in this skill.
4. Prior-week outputs, used only as a visual sanity check.

Never let an older card or earlier message override a newer correction to a name, cohort, order, date, title, or handle.

## Workflow

1. Validate the photo folder with `scripts/validate-weekly-input.mjs <photo-folder>`.
2. Analyze image dimensions with `scripts/analyze-images.mjs <photo-folder>`.
3. Build a card spec using `references/input-contract.md` and preserve metadata exactly.
4. Select layouts using the image analysis and `references/editorial-and-layout.md`.
5. Render only the requested cards with the current Decipher renderer.
6. Inspect every generated PNG, not only a representative sample.
7. Verify dimensions, text fit, spelling, line breaks, tag placement, crop quality, and requested file count.
8. Keep source photos and generated PNGs outside the repository.

Default output folder:

- Use the user-provided output folder when present.
- Otherwise use `<photo-folder>/output`.

## Content Rules

- Transcribe names, cohort, author order, date, session number, title, and handles exactly from the latest user instruction.
- Do not invent missing people, roles, affiliations, handles, dates, or session numbers. Use `확인 필요` only when a draft must be produced before confirmation.
- Use the public article or session title supplied by the user. Do not silently shorten or rewrite it.
- If a week has no speaker session, create the established blank speaker card with the requested date.
- A normal full set is weekly, speaker, interview cover, and one detail card per interview question. Do not force a fixed count when the request contains a different number of questions.
- Interview copy defaults to faithful mode: keep every substantive point, original tone, quotations, technical terms, and paragraph structure. Correct only spelling, spacing, and obvious typographical errors unless the user explicitly permits summarization.
- Use one question and its answer per interview detail card.
- If interview text is dense, preserve content in this order: improve paragraph breaks, add intentional title line breaks, use bounded font fitting, then report a readability limitation. Never silently delete content to make it fit.
- For long Korean titles, insert manual newlines at semantic boundaries. Do not split a word or grammatical ending awkwardly.

## Image Rules

- Preserve the person, presentation screen, and meaningful scene context before filling every pixel.
- Use `portraitBlur` for strongly vertical interview photos that would otherwise require an awkward wide crop.
- Use a restrained same-image blur fill behind a contained sharp foreground. Do not synthesize or alter a person's appearance.
- For two landscape weekly photos, stack them vertically. For portrait-heavy photos, use columns or weighted cells.
- When replacing one weekly photo, keep the other photo and its slot unchanged unless the user asks for a full recomposition.
- Avoid cuts through the head, neck, elbows, knees, or ankles. For full-body photos, crop at an intentional stable boundary while retaining useful environmental context.

## Renderer Guidance

- Single-card export size is `1080x1350`; strip mode is `3240x1350`.
- File names begin with `decipher-weekly-`, `decipher-speaker-`, or `decipher-interview-`.
- Interview detail titles must honor manual newlines with behavior equivalent to `white-space: pre-line`.
- Keep detail typography uniform within each answer. Use only bounded whole-block scaling; do not add arbitrary word-level emphasis or highly variable type sizes.
- Keep renderer changes limited to data input, image fit, layout selection, typography fitting, or export automation unless the user asks for a redesign.

## Verification

Before delivery:

- Verify every single-card PNG is exactly `1080x1350`.
- Open every output image and check text overflow, collisions, logo placement, photo crop, and visual balance.
- Compare all names, order, cohort, date, title, and handles against the latest request.
- Check Korean spelling and spacing without changing the speaker's intended meaning or voice.
- Check title line breaks are intentional and body paragraphs remain readable.
- Confirm Instagram appears near the interviewee name and X appears only on the photo-side tag when provided.
- Confirm a missing Instagram handle falls back to `@decipher_global`.
- Confirm a no-speaker week still has the blank date card.

Before publishing skill or renderer changes:

- Run `node scripts/audit-skill-privacy.mjs` from the skill directory.
- Run the skill validator and the renderer build.
- Stage only reusable source, documentation, and generic fixtures.
- Inspect the staged diff and staged binary list before commit and push.
