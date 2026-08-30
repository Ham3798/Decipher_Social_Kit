# Editorial And Layout Conventions

These rules are complete enough to use without finding prior-week outputs.

## Weekly

- Preserve the supplied public title verbatim except for obvious spelling or spacing corrections.
- Preserve presenter order exactly. Render the author line as `by 발표자 1, 발표자 2`.
- Keep one-photo or two-photo structure stable during a replacement request. Replacing one asset must not remove the other asset by accident.
- Use vertical stacking for two landscape photos. Use columns or weighted cells when vertical photos need more height.
- Favor images that make both the human subject and the presentation context legible.

## Speaker

- Use only the invited speaker's personal handle on the side tag.
- Do not place the employer or organization handle on the card.
- When no speaker session occurred, still output the established blank speaker card with the date only.
- Keep the speaker photo centered unless the subject position requires a small `object-position` adjustment.

## Interview Cover

- Put the Instagram handle directly below or near the interviewee name.
- If Instagram is absent, use the public organization fallback `@decipher_global`.
- Put X only on the photo-side tag. Do not duplicate X near the name.
- Do not invent a role, employer, or personal biography for the lower label.
- Compare the source aspect ratio with the interview photo frame before selecting a layout. If the relative difference is roughly 15% or less, default to `cover`; square sources normally belong in this path.
- Prefer a shallow, intentional crop over blur fill when the subject and scene remain legible. For a full-body source, a stable waist or mid-thigh crop is acceptable when it avoids awkward cuts.
- Use the two-layer treatment only when the portrait is substantially taller than the frame and `cover` would remove the face, torso, expressive hands, or essential setting: enlarge and softly blur the same image behind, then contain the sharp original in front.
- Keep blur restrained. It exists only to resolve a material aspect-ratio mismatch, not to preserve every source pixel or add atmosphere.

## Interview Detail

- Use one supplied question and its complete answer per card.
- Keep the title centered, bold, and visually consistent across the set.
- Keep the answer as one uniform text block. Do not vary word sizes, add arbitrary bold fragments, or create poster-like emphasis.
- Preserve the interviewee's wording and tone. Apply only spelling, spacing, punctuation, and light sentence-flow corrections by default.
- Preserve meaningful paragraph breaks. A short greeting or thesis sentence may stand alone, followed by one blank line, when that improves reading rhythm.
- For a long title, add a manual newline at a semantic boundary before reducing the title size.
- Use a small set of typography tiers for the whole body. Reduce size only as needed to fit all content; do not delete content silently.
- Keep the logo and footer clear of the final paragraph.

## Crop And Composition

- Preserve faces, hands when expressive, relevant screens, and scene-defining landmarks.
- Avoid cropping through the head, neck, elbows, knees, or ankles.
- For full-body portraits, a deliberate crop around the waist or mid-thigh is usually cleaner than leaving small feet near the frame edge. Preserve enough background to explain the setting.
- For lecture photos, avoid crops that show only a person or only a slide when the original communicates both.
- For square images, prefer a shallow cover crop when the subject is centered or can be preserved with a small focal-position adjustment. Do not introduce blur fill solely because the complete square image would otherwise lose a narrow edge.
- Do not use generative editing on a person's appearance unless the user explicitly requests it. Prefer crop, position, exposure-neutral framing, and same-image blur fill.

## Text Fit Order

Resolve overflow in this order:

1. Correct unintended blank lines or spacing.
2. Restore sensible paragraph breaks.
3. Insert intentional title newlines at meaning boundaries.
4. Use the next smaller bounded whole-block font tier.
5. Tighten line height slightly while preserving readability.
6. Report that the card is exceptionally dense.

Do not jump directly to aggressive summarization or tiny type.

## Visual QA

- Inspect every output at full-card scale.
- Check the longest title and longest answer, not only the cover.
- Check names, cohort, title, author order, date, and both platform handle locations.
- Check each crop independently; one good image does not validate the other image in a collage.
- Verify the requested card count and confirm that no stale prior-week card remains in the output set.
