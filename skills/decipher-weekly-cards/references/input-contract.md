# Decipher Weekly Card Input Contract

This reference defines how to turn loose weekly notes into a stable card spec.

## User Input

Expected natural input:

```text
사진 폴더: <photo-folder>
메모:
- 2026-1 Weekly Session # N
- 주제: ...
- 발표자: ...
- 연사: ...
- 인터뷰: ...
원하는 카드: weekly, speaker, interview
출력 폴더: <output-folder>
```

Only `사진 폴더` is strictly required for image work. If no memo is provided, ask for content before generating final public copy unless the user explicitly asks for placeholders.

## Internal Spec

Use this shape internally:

```json
{
  "weekly": {
    "enabled": true,
    "week": "카드 제목",
    "topic": "by 이름1, 이름2",
    "date": "2026-1 Weekly Session # N",
    "images": ["<image1>", "<image2>"]
  },
  "speaker": {
    "enabled": false,
    "name": "이름",
    "title": "직함 / 소속",
    "date": "YYYY.MM.DD",
    "tag": "@handle",
    "image": "<image>"
  },
  "interview": {
    "enabled": false,
    "name": "기수 이름",
    "role": "@instagram_handle_or_decipher_global",
    "tag": "@x_handle",
    "image": "<image>",
    "imageLayout": "cover | portraitBlur",
    "slides": [
      {
        "title": "질문 또는 섹션 제목",
        "body": "요약 답변"
      }
    ]
  }
}
```

The existing renderer's `TemplateData` may not include `enabled` or image arrays. Convert this spec into the renderer's concrete image fields before export.

Use `imageLayout: "portraitBlur"` for interview cover photos with a strong portrait/tall aspect ratio when a normal wide crop would cut the person or feel visually awkward.

## Session Type Detection

- `weekly`: notes mention weekly, 세션, 발표자 2명, 주제, recap, study, session number.
- `speaker`: notes mention 연사, 게스트, speaker, 소속/직함, guest handle.
- `interview`: notes mention 인터뷰, 자기소개, 질문/답변, 기수, personal handle.
- Mixed set: generate all clearly supported card types.

For interview handles, use Instagram for the main lower role field near the name. If Instagram is missing, use `@decipher_global` in the lower role field. Use X/Twitter only for the dark photo-side tag when present. If the note labels handles by platform, preserve that platform split exactly.

## Image Selection

- Prefer lecture room wide shots for weekly.
- Prefer one speaker plus slide image for speaker.
- Prefer portrait/person image for interview cover.
- If multiple candidate images fit the same card, choose the sharpest and most content-rich image. If uncertain, choose the least cropped option and list alternatives in final response.

## Text Length Guidelines

- Weekly title: 1-2 lines, roughly 10-28 Korean characters per line.
- Weekly topic/authors: one short line if possible.
- Speaker name: short display string only.
- Speaker title: one line, avoid long biographies.
- Interview detail title: short question or section title.
- Interview detail body: 1-3 paragraphs, each compact; summarize aggressively if needed.

## Output Names

- Weekly: `decipher-weekly-<stamp>.png`
- Speaker: `decipher-speaker-<stamp>.png`
- Interview cover: `decipher-interview-cover-<stamp>.png`
- Interview slide: `decipher-interview-slide-<n>-<stamp>.png`

Use deterministic suffixes only if the user asks for stable filenames.
