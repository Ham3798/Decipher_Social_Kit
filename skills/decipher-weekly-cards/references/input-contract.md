# Decipher Weekly Card Input Contract

Convert loose notes into a stable internal card spec without inventing missing facts.

## User Input

```text
사진 폴더: <photo-folder>
메모:
- 세션 라벨 또는 날짜
- 주제
- 발표자 순서
- 연사 정보
- 인터뷰 질문과 답변
- 플랫폼별 공개 핸들
원하는 카드: weekly, speaker, interview
출력 폴더: <output-folder>
```

Only `사진 폴더` is required for image-only revisions. Final public copy still requires the relevant metadata or explicit permission to use placeholders.

## Internal Spec

```json
{
  "weekly": {
    "enabled": true,
    "week": "카드 제목",
    "topic": "by 발표자 1, 발표자 2",
    "date": "학기 Weekly Session # N",
    "images": ["<image-1>", "<image-2>"]
  },
  "speaker": {
    "enabled": true,
    "mode": "filled | blank",
    "name": "연사 이름",
    "title": "직함 / 소속",
    "date": "YYYY.MM.DD",
    "tag": "<speaker-personal-handle>",
    "image": "<image>"
  },
  "interview": {
    "enabled": true,
    "contentMode": "faithful",
    "name": "기수 인터뷰이",
    "role": "<instagram-handle-or-decipher-global>",
    "tag": "<x-handle>",
    "image": "<image>",
    "imageLayout": "cover | portraitBlur",
    "slides": [
      {
        "title": "질문 또는 섹션 제목",
        "body": "원문 의미와 문단을 보존한 답변"
      }
    ]
  }
}
```

The renderer may not expose `enabled`, `mode`, `contentMode`, or image arrays. Resolve those fields before mapping the spec to the renderer's concrete data structure.

## Metadata Contract

- Copy the latest user-provided name, cohort, date, title, author order, and handle exactly.
- Treat a correction as a replacement for the older value, not an optional alternative.
- Never infer a platform from the shape of a handle. Use the platform label in the notes.
- Never reuse a company handle as a speaker's personal handle.
- Use `확인 필요` for a missing public field only when the user expects a draft before clarification.

## Card-Type Rules

- `weekly`: title, author order, session label, and one to three session photos.
- `speaker`: filled card when a speaker exists; blank date-only card when the week has no speaker session.
- `interview`: cover plus exactly one detail card per supplied question and answer.

For interview handles:

- Put Instagram in the lower role field near the interviewee name.
- Use `@decipher_global` there when Instagram is absent.
- Put X only in the dark photo-side tag when X is supplied.
- Leave the side tag empty when no X handle is supplied.

## Text-Fidelity Contract

- Default `contentMode` is `faithful`.
- Preserve substantive claims, examples, qualifications, quotations, technical terms, and the interviewee's tone.
- Correct spelling, spacing, and obvious typographical errors without upgrading or sanitizing the voice.
- Preserve paragraph boundaries where they carry meaning. Add paragraph breaks only to improve reading rhythm.
- Do not summarize, omit, or combine answers unless the user explicitly allows it.
- Use manual title newlines at semantic boundaries when a long question would wrap awkwardly.
- Fit dense copy with restrained whole-block font tiers. Do not use decorative emphasis within a paragraph.

## Image Selection

- Weekly: prefer clear session photos that retain the presenter and screen context.
- Speaker: prefer one photo that clearly identifies the invited speaker and session setting.
- Interview: prefer a sharp portrait. Choose `cover` for square or near-frame-ratio photos and accept a shallow intentional crop. Choose `portraitBlur` only when a substantially taller source would suffer a destructive crop through the subject or essential scene context.
- When several candidates are viable, choose the sharpest image with the strongest subject separation and least destructive crop.

## Output Names

- Weekly: `decipher-weekly-<stamp>.png`
- Speaker: `decipher-speaker-<stamp>.png`
- Interview cover: `decipher-interview-cover-<stamp>.png`
- Interview detail: `decipher-interview-slide-<n>-<stamp>.png`

Use deterministic suffixes only when requested.
