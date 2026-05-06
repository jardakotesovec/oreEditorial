# Ore Editorial — OJS plugin

Adds editorial-workflow nudges to OJS. Currently ships one feature: a notice
that appears above the Round Status when peer-review recommendations indicate
the article meets criteria for acceptance but no Version of Record has been
published yet.

## When the notice shows

In the editor view of the workflow modal, on the *Internal Review* or
*External Review* stage, when **all** of the following hold:

- At least 2 reviews in the current round are confirmed by the editor (status
  `COMPLETE` or `THANKED`) with reviewer recommendation type **APPROVED**, **or**
  at least 1 APPROVED plus 2 with type **REVISIONS_REQUESTED**.
- No publication on the submission has `versionStage === 'VoR'` and is
  published. Once a Version of Record is published, the notice disappears.

Author-side workflow views never show the notice.

## Requirements

OJS 3.6 or later (uses the JS hook system introduced in 3.5/3.6).

## Installation

Drop this repo into `plugins/generic/oreEditorial/` of your OJS installation
(as a submodule or a plain clone). The repo already includes the built JS/CSS
under `public/build/`, so no `npm install`/`npm run build` step is required
to use it. Then enable **Ore Editorial** under *Settings → Website → Plugins*.

## Development

```bash
npm install
npm run build      # one-shot
npm run dev        # watch mode
```

The build outputs `public/build/build.iife.js` and `public/build/build.css`,
loaded into the OJS `backend` context by `OreEditorialPlugin::register()`.

## Architecture

- `OreEditorialPlugin.php` — thin `GenericPlugin` that registers the IIFE
  bundle for the backend context. No PHP-side state injection.
- `resources/js/main.js` — extends the workflow Pinia store via
  `pkp.registry.storeExtend('workflow', …)` and hooks `getPrimaryItems` to
  insert the notice directly above `WorkflowSubmissionStatus` on review
  stages, on the editorial dashboard only.
- `resources/js/Components/OreReviewCriteriaMet.vue` — Composition-API SFC
  that evaluates the trigger conditions from `submission.reviewAssignments`
  and `submission.publications` and renders a single localized line when
  the criteria are met.

## License

GPL-3.0
