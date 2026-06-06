---
name: decipher-weekly-cards
description: Generate Decipher weekly Instagram card/news PNG sets with week1-style visual consistency, mixed-aspect photo layout, Korean card copy inference, and one-shot folder plus memo workflow. Use when Codex needs to create Decipher weekly, speaker, interview, or card-news images from a photo folder and free-form notes, especially for Instagram 1080x1350 outputs using the existing Decipher template renderer.
---

# Decipher Weekly Cards

Use this skill to create Decipher Instagram card sets from a photo folder and free-form Korean notes in one pass. The default output is 1080x1350 PNG cards that match the visual tone of the established week1 baseline exports.

## Quick Start

1. Confirm the input photo folder exists with `scripts/validate-weekly-input.mjs <photo-folder>`.
2. Analyze photo dimensions with `scripts/analyze-images.mjs <photo-folder>`.
3. Apply the Decipher conventions below before generating copy. If prior week outputs are available, inspect them as a sanity check, but do not rely on inspection for these defaults.
4. Read `references/week1-style.md` before deciding layout or visual treatment.
5. Read `references/input-contract.md` when converting loose notes into the internal card spec.
6. Use the current Decipher renderer workspace unless the user gives a different renderer path. If unclear, locate the project that contains the React template renderer and export script.
7. Generate or update the renderer payload so it exports only the requested cards.
8. Inspect generated PNGs before finalizing. Check dimensions, text fit, logo placement, and photo crop quality.

## One-Shot Input Handling

Accept a request like:

```text
사진 폴더: <photo-folder>
메모: 자유형 한국어 텍스트, 발표자/주제/날짜/인터뷰 답변/링크
원하는 카드: optional
출력 폴더: optional
```

Do not stop just because the note is incomplete. Infer conservatively from the folder name, image file names, and note text. Report uncertain fields in the final response as `확인 필요`.

Default output folder:

- Use the user-provided output folder if present.
- Otherwise use `<photo-folder>/output`.
- Keep generated photos and PNGs outside the repository unless the user explicitly asks for public sample assets.

## Content Inference Rules

Infer these fields:

- Weekly: title/topic, authors, date/session number, 1-3 representative images.
- Speaker: name, title or affiliation, date/session number, tag, representative image.
- Interview: name, Instagram handle for the lower name-area label, X/Twitter handle for the dark photo-side tag, cover image, slide titles, and summarized bodies.

Defaults:

- If date/session number is missing, use a tentative label like `2026-1 Weekly Session # 확인 필요`.
- If authors are missing, use `by 확인 필요` instead of inventing names.
- For weekly cards, prefer the public article or session title from the notes over a shortened topic label. Match prior weeks' `2026-1 Weekly Session # N` spacing and omit dates unless earlier cards of that type include them.
- For speaker cards, use the speaker date style, typically `YYYY.MM.DD`. Use only the speaker's personal handle for the card side tag when present; do not place company or organization handles on the card.
- For interview cards, put Instagram near the name in the lower label. If Instagram is missing, use `@decipher_global` in that lower label. Put X/Twitter only in the dark photo-side tag when present. Do not invent role text.
- If there is no speaker session for a week, still create a blank speaker card with the date when prior no-speaker weeks used that convention.
- Standard mixed weekly output is eight files: weekly, speaker, interview cover, and five interview detail slides unless the user asks for fewer.
- Keep Korean copy concise. Summarize long notes into readable card text and avoid dense paragraphs that overflow 1080x1350.

## Image Layout Rules

Use the image analyzer classifications:

- `wide` or `landscape`: preserve context. Prefer a white frame with `object-fit: contain` or a shallow crop that keeps slides, presenter, and screen visible.
- `portrait` or `tall`: avoid cutting faces or bodies. When the aspect-ratio difference is large, use the interview `portraitBlur` treatment: blurred fill from the same image behind the original photo, with the original photo preserved via contain. This should be the default for interview cover portraits that look awkward in the wide frame.
- `square`: can use center crop when the subject is centered; otherwise preserve full image.
- Weekly two-photo collage: stack two landscape photos vertically inside the week1 frame; use left/right columns when portrait-heavy images need more height.
- For week1-style main cards, align the bottom edge of the weekly, speaker, and interview photo frames. Keep speaker/session photos centered horizontally unless the user gives a different crop direction.

When unsure, bias toward preserving the photo's meaningful content over filling every pixel.

## Renderer Guidance

- The React template supports `weekly`, `speaker`, and `interview`.
- For interview portrait covers, set `interview.imageLayout` to `portraitBlur` when the photo is too vertical for a clean wide crop.
- Export size is 1080x1350 for single cards and 3240x1350 for strip mode.
- File names should follow `decipher-weekly-*`, `decipher-speaker-*`, and `decipher-interview-*`.
- Keep generated weekly artifacts outside the repository. Do not commit source photos, generated cards, personal handles, raw interview answers, or week-specific notes.

If implementation requires renderer changes, keep them narrowly scoped to data input, image fit/layout selection, or export automation. Do not rewrite the visual system unless the user explicitly asks.

## Verification Checklist

- Run `scripts/validate-weekly-input.mjs <photo-folder>`.
- Run `scripts/analyze-images.mjs <photo-folder>` and use its output in layout decisions.
- Verify every exported PNG is 1080x1350 unless the user requested strip mode.
- Open at least one output image visually when possible.
- Check Korean text does not overflow or collide with logo/tag elements.
- Check photos are not unnecessarily cropped and that mixed-aspect images still feel intentional.
- Before committing skill changes, search for personal paths, raw weekly inputs, personal handles, and generated media.
