
# Decipher Social Kit

This repository contains the Decipher Instagram card renderer and an importable Codex skill for generating Decipher weekly card-news PNG sets.

## Running the Renderer

Run `npm i` to install dependencies.

Run `npm run dev` to start the development server.

Run `npm run build` before publishing renderer changes.

## Codex Skill

The importable Codex skill is in [`skills/decipher-weekly-cards`](skills/decipher-weekly-cards). Use that folder as the skill import path.

For a local Codex setup, copy or symlink the folder into your Codex skills directory:

```sh
mkdir -p ~/.codex/skills
cp -R skills/decipher-weekly-cards ~/.codex/skills/
```

Then use it in Codex with a prompt such as:

```text
Use $decipher-weekly-cards to create this week Instagram card set from my photo folder and notes.
```

The skill is sanitized for public use. It does not include weekly source photos, generated cards, raw interview answers, personal local paths, or private handles.

## Workflow

See [Decipher Weekly Card Workflow](docs/DECIPHER_WEEKLY_CARD_WORKFLOW.md) for the reusable, privacy-safe card generation process and card convention guardrails.
