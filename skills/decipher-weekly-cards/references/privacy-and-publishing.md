# Privacy And Publishing

Weekly source material is ephemeral session input. The reusable skill and public repository must contain only generic rules, code, and synthetic placeholders.

## Never Commit

- Source portraits, lecture photos, screenshots, or generated weekly PNGs.
- Raw interview answers, private notes, chat exports, or copied message timestamps.
- Personal names, cohorts, personal social handles, email addresses, phone numbers, or home-directory paths used by a specific run.
- Image metadata or filenames that expose a messaging app, timestamp, device, or person.
- Credentials, tokens, cookies, private URLs, or environment files.

The public organization fallback `@decipher_global` is allowed because it is a stable product convention. All other examples must use generic placeholders.

## Runtime Handling

- Read local photos only for the requested generation task.
- Do not upload, web-search, or otherwise redistribute source photos unless the user explicitly requests that action.
- Export cards to the user-supplied folder or `<photo-folder>/output`, outside the repository.
- A card intended for public posting does not make its raw source photo or interview transcript appropriate repository content.

## Reusable Documentation

- Describe learned behavior as general rules, not as a story about a specific person or week.
- Use placeholders such as `<photo-folder>`, `<x-handle>`, `발표자 1`, and `인터뷰이`.
- Do not preserve exact private prompts, local absolute paths, or real handles as examples.
- Keep privacy checks generic and report only the violation type and file location, never the matched sensitive value.

## Pre-Publish Audit

Before staging:

1. Run `node scripts/audit-skill-privacy.mjs` from the skill directory.
2. Run the skill validator.
3. Run the renderer build when renderer code changed.
4. Review `git status --short` and identify the exact reusable files in scope.

After staging:

1. Stage explicit paths; do not use a broad add in a mixed worktree.
2. Run `git diff --cached --check`.
3. Review `git diff --cached --stat` and the full staged text diff.
4. List staged binary files and confirm no personal media is included.
5. Run a staged-content scan for personal paths, contact data, credentials, and week-specific filenames without printing matched secrets.

Commit and push only when the user explicitly requests publication. If history rewriting is requested, verify prohibited text is absent from the reachable history before force-pushing.
