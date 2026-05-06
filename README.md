# Ore Editorial — OJS plugin

A small plugin tailored to the ORE (Open Research Europe) overlay-journal
workflow. It alerts editors on the Review Stage as soon as the round has
gathered enough confirmed reviewer recommendations to justify creating a
Version of Record, so the next editorial step doesn't get overlooked.

## When the notice shows

The notice renders above the Round Status panel in the editor's workflow
view, on the *Internal Review* or *External Review* stage, when **all** of
the following hold:

- The current round has at least 2 confirmed reviews (status `COMPLETE` or
  `THANKED`) recommending **APPROVED**, or at least 1 APPROVED together
  with 2 recommending **REVISIONS_REQUESTED**.
- No publication on the submission is yet published with
  `versionStage = 'VoR'`. Once the Version of Record exists the notice
  goes away on its own.

The author view of the workflow never shows the notice.

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
