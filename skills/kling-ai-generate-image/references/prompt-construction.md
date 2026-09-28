# Image prompt construction

## Minimally sufficient prompt

Preserve a prompt verbatim when the user explicitly requests it. Otherwise select only details that affect the result, with facts, exact text, and protected elements before atmosphere.

Separate the brief into three groups:

1. **Hard constraints:** preserve every explicit subject, identity, product structure, copy string, count, destination, and forbidden change.
2. **Creative choices:** apply the requested action, environment, composition, lighting, palette, material, and style.
3. **Necessary completion:** infer a default from the destination only when omission would make the composition ambiguous or unusable; ask when it cannot be inferred reliably.

The final prompt should be one coherent visual description. Every added phrase must create an observable difference. Do not fill every category merely to sound professional. Keep ratio, resolution, result count, and model in structured parameters rather than repeating them in the prompt.

## Delivery-grade quality profiles

Choose one primary profile from the intended use; add a secondary profile only when the request genuinely spans contexts. A profile controls visible prompt facts and the acceptance gate, not model or credit level.

### Commercial product and ecommerce

- **Prompt focus:** lock geometry, proportions, label placement, and brand colors; define primary view, surface material, controlled reflection, contact shadow, and background separation.
- **Acceptance gate:** caps, soles, controls, ports, and other structures do not drift; glass, metal, plastic, and fabric have distinct highlight width and roughness; labels remain recognizable without invented text; the silhouette supports isolation or layout crops.
- **Avoid:** hiding evidence with smoke, splashes, or floating debris, and distorting product shape with excessive wide-angle perspective.

### Advertising key visual and poster

- **Prompt focus:** one communication focus; foreground/midground/background hierarchy; a brand-color and contrast mechanism; usable safe space for headline, logo, or call to action.
- **Acceptance gate:** the subject reads first even at thumbnail size; any metaphor supports a real product fact; negative space can hold actual typography rather than decorative texture.
- **Avoid:** competing heroes, atmosphere elements without a communication role, and asking the model to invent marketing copy.

### Portrait, identity, and fashion

- **Prompt focus:** lock facial structure, age presentation, skin tone, hairline, and distinguishing traits; specify gaze, expression, pose, garment cut, key-light position, and catchlights.
- **Acceptance gate:** identity is neither averaged nor beautified into another person; skin retains natural volume and texture; hands and anatomy remain plausible; fabric tension, pattern, fastening, and logo position remain accurate.
- **Avoid:** unsupported changes to age, body, or ethnicity, and using plastic skin, excessive smoothing, or unmotivated rim light as shorthand for quality.

### Narrative concept and cinematic still

- **Prompt focus:** define the story moment first, then character/environment geography, blocking, visible light sources, depth layers, and color script. Camera language must serve emotion or reveal information.
- **Acceptance gate:** the frame answers who is doing what and where; light can be traced to windows, fixtures, fire, neon, or sky; scene details belong to one era, place, and production-design system.
- **Avoid:** stacking grain, darkness, anamorphic flare, shallow depth, and haze in place of actual staging.

### Reference edit and brand variant

- **Prompt focus:** treat the source as the factual baseline and define every allowed change. List the identity, product structure, viewpoint, perspective, logo, copy, and background facts that stay locked.
- **Acceptance gate:** unauthorized regions do not drift; new light, season, color, or environment respects original perspective, occlusion, and material response; variants change only approved dimensions.
- **Avoid:** redescribing the whole source and accidentally rewriting facts, or treating a style reference as identity, product, or composition evidence.

Read [image scene patterns](scene-patterns.md) only when finer destination choices are needed.

## Prompt order

Use only the categories that matter, in this order:

1. Destination and medium: product photo, editorial portrait, poster, thumbnail, campaign still.
2. Subject and locked facts: identity, product geometry, exact colors, official logo or copy.
3. Action or visual idea.
4. Environment, time, weather, and atmosphere.
5. Composition: horizontal, vertical, or square layout; framing, camera height, lens feel, focal hierarchy, negative space, and safe area. Keep the exact ratio in structured parameters.
6. Lighting and palette.
7. Materials, texture, surface detail, and realism/stylization level.
8. Constraints: subject count, forbidden changes, no extra text/watermark, safe-space requirements.

If hard constraints conflict, do not silently select one. Ask the smallest question needed to resolve the conflict. User facts override templates, stylistic convention, and model defaults.

## Local edits

The loaded reference-input module handles inspection, roles, and limits. Write allowed changes first, then protected facts. For example: change the background to a pale-gray studio while preserving bottle geometry, cap, label text, and color; use soft rear-side light for the glass and front fill for label readability. Do not turn local edits into product redesign or unrequested beautification.

## Exact text

- Preserve user copy character-for-character.
- Use a copy-safe base for later typography only when the user accepts that workflow and an appropriate design tool exists. Do not replace a requested finished image with a text-free base.
- For generated text, specify exact wording, position, hierarchy, and language once. Do not add unrelated copy or remove existing labels. Preserve multiple requested passages without shortening or rewriting them. Inspect readability before judging; correct prompt text does not prove correct output text.

## Controlled variants

Use separate prompts for different requested concepts; for multiple outputs of the same prompt, honor authorized count and live batch caps without splitting into extra paid calls. Vary one dimension by default for controlled comparisons, or all explicitly requested dimensions, keeping other facts fixed:

- concept: literal / human / metaphorical
- camera: macro / medium / environmental wide
- composition: centered / power-third / overhead
- mood: bright commercial / premium restrained / energetic saturated
- expression or action

## Avoid

- Empty praise such as “beautiful” without visual evidence.
- Labels such as “masterpiece,” “best quality,” “8K,” or “ultra HD” that do not specify an observable result.
- Contradictory directions such as minimal and densely layered, or macro and full environmental wide.
- Long negative lists that repeat the positive brief.
- Model, resolution, aspect ratio, or image-count parameters inside the creative prompt.
- Unverified product claims, medical outcomes, prices, awards, certifications, or statistics.
- Assuming a particular model or argument exists without checking the live schema.
