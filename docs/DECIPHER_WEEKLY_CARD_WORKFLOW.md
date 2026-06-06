# Decipher Weekly Card Workflow

This document captures the reusable workflow for generating Decipher Instagram card sets without storing personal weekly inputs in the repository.

## Output Contract

- Export all single cards at `1080x1350`.
- Keep generated weekly artifacts outside the repository, usually in the source photo folder's `output/` directory.
- Do not commit source photos, generated cards, personal handles, interview answers, or week-specific notes.
- Commit only reusable renderer behavior, workflow documentation, and generic examples.

## Codex Skill Import

- The importable Codex skill lives at `skills/decipher-weekly-cards/`.
- Install it by copying or symlinking that folder into a Codex skills directory, such as `~/.codex/skills/decipher-weekly-cards`.
- Invoke it with `$decipher-weekly-cards` when asking Codex to generate Decipher weekly cards.
- It contains only generic workflow rules, renderer facts, scripts, and style baselines.
- Do not include personal home paths, raw interview answers, weekly source folders, exported PNGs, social handles from private notes, or issue-specific prompts.
- Use placeholders such as `<photo-folder>`, `<output-folder>`, and `<renderer-workspace>` in public skill docs.
- Keep examples synthetic unless the referenced names, handles, and card text are already intended for public Instagram publication.

## Card Types

- `weekly`: one top collage, title, author line, and session label.
- `speaker`: one session/speaker photo, speaker name, title or affiliation, and session label.
- `interview`: cover card plus one detail card per interview question or section.

## Week1 Visual Baseline

Use the original week1 exports as the visual source of truth, not just old component defaults.

Main frame targets:

- Weekly photo frame outer box: `x=80`, `y=86`, `w=920`, `h=716`.
- Speaker photo frame outer box: `x=107`, `y=174`, `w=866`, `h=618`.
- Interview cover photo frame outer box: `x=170`, `y=86`, `w=740`, `h=706`.

Other style rules:

- Keep the warm paper background, subtle watermark, white photo matte, and restrained black/gray typography.
- Keep the speaker image horizontally centered and clear of the top-left logo.
- Keep interview detail slide typography visually close to week1: bold centered title and large, heavier body text.
- Keep logos and tags secondary; do not let platform labels dominate the card.

## Image Layout Rules

- Weekly with two landscape images: stack top/bottom inside the weekly frame.
- Weekly with portrait-heavy images: use left/right columns so subjects keep enough height.
- Speaker photo: use the centered week1 frame and avoid overlap with the top-left logo.
- Interview cover photo: preserve the week1 frame; adjust `object-position` when the subject is near an edge.
- If an interview portrait is much taller than the frame and a normal crop looks awkward, use the portrait blur-fill treatment: blurred same-image fill behind the original photo, with the original photo contained in front.
- Prefer light crops that preserve the subject, screen, and lecture context.

## Tag Rules

- Use the Instagram handle as the main lower text near the interviewee name.
- If Instagram is missing, use `@decipher_global` as the main lower text.
- Use the X/Twitter handle only as the dark photo-side tag when present.
- Avoid adding platform labels directly on the card unless the design is intentionally revised.

## One-Shot Generation Flow

1. Validate the photo folder exists and contains supported images.
2. Analyze image dimensions and classify each image as landscape, portrait, square, wide, or tall.
3. Apply the established Decipher conventions below before choosing copy. If prior week outputs are available, inspect them as a sanity check.
4. Infer the card spec from user notes: card types, title, authors, session label, speaker fields, interview fields, and slide content.
5. Convert notes into concise card copy; summarize long interview answers.
6. Render cards through the existing React template and export PNGs.
7. Visually inspect representative cards and verify dimensions with `sips`.
8. Report inferred fields that still need confirmation.

Convention guardrails:

- Weekly cards use the public article or session title from the notes, not an invented short topic label.
- Weekly session labels follow the prior format, such as `2026-1 Weekly Session # 5`, and omit dates unless earlier cards of that type include them.
- Speaker cards use the prior speaker date style, usually `YYYY.MM.DD`. Use only the speaker's personal handle for the card side tag when present; do not place company or organization handles on the card.
- Interview cover cards do not invent role text. Put Instagram near the name, fall back to `@decipher_global` when Instagram is missing, and put X/Twitter only on the photo-side tag when present.
- Standard mixed weekly output is eight files: weekly, speaker, interview cover, and five interview detail slides unless the user asks for fewer.

## Verification Checklist

- `npm run build` passes.
- Every exported single-card PNG is `1080x1350`.
- Weekly, speaker, and interview cover photo frames match the week1 coordinate baseline.
- Weekly two-landscape collages render top/bottom.
- Interview detail typography matches week1 visually.
- No private weekly inputs are staged or committed.
