# Motion and shot planning

## Motion-prompt principles

- Lock user facts, opening state, identity, and product structure before defining allowed change.
- Describe time in order: opening state → subject action → observable end state. Separate subject, camera, and environmental motion instead of using abstractions such as “dynamic scene.”
- Keep only actions that fit the selected duration. Default to one subject action and one camera path; add environmental motion only when it reveals physical feedback such as wind, rain, dust, smoke, or liquid.
- For image-to-video, do not reimagine the first frame. State what remains fixed, what may move, the permitted motion range, and the final camera position.
- Keep ratio, resolution, output count, and model in structured parameters. Put duration in the prompt only when it helps stage timed beats.

## Delivery-grade motion profiles

Choose one primary profile; add a secondary profile only when the request genuinely spans contexts. The profile sets motion budget, camera path, continuity anchors, and acceptance criteria.

### Cinematic continuous shot

- **Prompt focus:** one narrative moment, subject blocking, one camera path, necessary environmental response, and a final landing point organized around one reveal or emotional turn.
- **Acceptance gate:** subject action has preparation, execution, and settle; camera starts and stops smoothly; direction, focus, exposure, and visible light sources remain continuous; the end frame stands on its own.
- **Avoid:** simultaneous push/pull/pan/orbit, abrupt location change in five seconds, or slow motion, handheld shake, and flare used in place of story.

### Image-to-video

- **Prompt focus:** use the first frame as the factual baseline; define movable regions, amplitude, parallax range, and camera endpoint, plus locked identity, product structure, background, and composition.
- **Acceptance gate:** no jump between source frame and first motion; faces, hands, logos, and rigid structures do not melt; background parallax agrees with camera displacement; unauthorized regions remain stable.
- **Avoid:** combining large subject motion, aggressive camera motion, and scene transformation, or redescribing the source with a new appearance.

### Product ad and feature demonstration

- **Prompt focus:** assign each shot one job—reveal, structure, function, use, or close—and time material highlights, mechanical travel, hand contact, and brand visibility.
- **Acceptance gate:** dimensions, ports, labels, and moving parts remain consistent; highlights travel continuously with camera/product motion; hand contact and mechanics remain physical; the ending holds as a usable hero frame.
- **Avoid:** unsupported features, fast orbits that deform structure, and effects that obscure product evidence.

### UGC and social short

- **Prompt focus:** credible phone position, natural performance, real-world audiovisual rhythm, and one immediate hook. Handheld motion keeps only mild body inertia; exposure and focus changes stay restrained.
- **Acceptance gate:** it feels creator-shot while the subject remains readable; action and reaction are not overperformed; platform-safe areas preserve key information; no fabricated testimonial or before/after claim.
- **Avoid:** treating UGC as poor quality, violent shake, missed focus, or random exposure.

### Multi-shot narrative and commercial

- **Prompt focus:** give each shot a communication job, duration, scale, action, camera path, continuity anchors, and entry/exit; build edit points from action, gaze, composition, or screen direction.
- **Acceptance gate:** total timing closes; every shot adds information; identity, wardrobe, product, location, color script, and light direction remain continuous; action and geography cut coherently.
- **Avoid:** repeated “different angles” with no new information, or regenerating characters, products, and setting facts per shot.

### Motion control

- **Prompt focus:** use the subject image as appearance baseline and motion source as rhythm/joint-path baseline; specify facing direction, foot contact, weight transfer, amplitude, and source-audio intent.
- **Acceptance gate:** joint paths remain continuous; limb length and clothing do not drift; feet do not slide and contacts do not intersect; motion speed follows the source; face and background are not rebuilt.
- **Avoid:** mismatched body coverage between subject and motion source, multiple competing subjects, or direction changes mid-motion.

Read [video scene patterns](scene-patterns.md) only when finer format decisions are needed.

## Motion-first prompt order

1. Opening frame and subject placement.
2. Primary subject action with beginning, progression, and observable end state.
3. One camera path, speed, and final landing point.
4. Necessary environmental motion and physical feedback.
5. Lighting, palette, depth, and temporal atmosphere that directly affect motion.
6. Continuity locks: identity, wardrobe, product geometry, logo, architecture, screen direction.
7. Add a constraint only when it prevents a likely error, such as an extra subject, deformation, unsolicited text, or watermark.

If actions, camera paths, or end states conflict, do not merge them silently. Ask only the smallest question needed to resolve the conflict.

## Camera vocabulary

- `locked-off`: observation, product detail, graphic composition
- `slow push-in`: emphasis, intimacy, reveal of detail
- `pull-back reveal`: expand context or scale
- `lateral tracking`: follow motion while preserving profile/geography
- `orbit`: dimensional product/character reveal; keep speed restrained
- `crane rise/drop`: establish or conclude with scale
- `handheld follow`: urgency or UGC authenticity; specify controlled versus energetic
- `whip pan`: transition or impact; use sparingly and only with a clear landing subject

Do not stack several camera verbs in a five-second shot.

Do not write an ambiguous “move quickly.” State who or what moves, in which direction, at what pace, and where it stops.

## Short-duration fit

- 5 seconds: one action and one camera move.
- 10 seconds: one action with setup/payoff, or two simple connected beats.
- 15 seconds: compact three-beat sequence when supported, otherwise one developed continuous shot.

Treat these as planning heuristics, not provider capabilities; use only duration values accepted by the live schema.

## Multi-shot template

```text
SHOT 1 — <duration>: <framing>; <single story job>; <subject action>; <camera action>.
Continuity: <identity/product/location anchors>.

SHOT 2 — <duration>: <framing>; <new story job>; <subject action>; <camera action>.
Continuity: preserve <anchors>; transition via <match/action/screen direction>.
```

Keep the total duration consistent. Each shot should add information rather than repeat a prettier angle.

## Reference handling

- First-frame input: preserve composition and animate within it.
- Multiple references: identify each role explicitly; do not treat all images as interchangeable style inputs.
- Character continuity: lock face, age presentation, hair, wardrobe, proportions, and distinctive features.
- Product continuity: lock dimensions, materials, label spelling, logo placement, and moving-part behavior.

## Motion-control assets

- Keep the person or animal clearly visible in the subject image and match the body framing to the motion-source video when possible.
- Use one continuous motion-source shot; avoid cuts, occlusion, extremely fast movement, or multiple competing subjects.
- Kling's current official guide recommends a 3–30 second motion video, a short edge of at least 340 px, and a long edge no greater than 3850 px. Enforce any stricter live MCP schema constraint.
- `motion_control` requires the subject `image` and exactly one of library `motionId` or input `video`. Use only direction, resolution, and original-sound fields declared by the current model in `who_am_i`.

## Ads and explainers

Assign one communication job per beat:

- hook: earn attention without a false claim
- context: show the problem or setting
- proof: demonstrate a real product/action/detail
- payoff: hero result or supplied message

Do not invent performance claims, user testimony, statistics, pricing, awards, certifications, or regulatory statements.

## Submission check

Check duration, resolution, ratio, shot structure, and protected elements internally before submission. Confirm that the prompt does not repeat structured parameters, exceed the action budget, contain conflicting directions, or omit an observable end state. Do not show a pre-submission process message, credit warning, or separate confirmation unless a creative requirement is missing and the user must clarify it.
