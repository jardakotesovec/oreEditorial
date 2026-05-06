import OreReviewCriteriaMet from './Components/OreReviewCriteriaMet.vue';

pkp.registry.registerComponent('OreReviewCriteriaMet', OreReviewCriteriaMet);

pkp.registry.storeExtend('workflow', (piniaContext) => {
	const dashboardStore = pkp.registry.getPiniaStore('dashboard');
	if (dashboardStore?.dashboardPage !== 'editorialDashboard') {
		return;
	}

	const workflowStore = piniaContext.store;

	workflowStore.extender.extendFn('getPrimaryItems', (items, args) => {
		const reviewStages = [
			pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
			pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
		];

		const stageId = args?.selectedMenuState?.stageId;
		const primaryMenuItem = args?.selectedMenuState?.primaryMenuItem;

		if (primaryMenuItem !== 'workflow' || !reviewStages.includes(stageId)) {
			return items;
		}

		const notice = {
			component: 'OreReviewCriteriaMet',
			props: {
				submission: args.submission,
				selectedReviewRoundId: args.selectedReviewRound?.id ?? null,
			},
		};

		// Insert directly above the Round Status, i.e. just below the language
		// selector. Fall back to prepending if WorkflowSubmissionStatus isn't
		// present for some reason.
		const statusIndex = items.findIndex(
			(item) => item.component === 'WorkflowSubmissionStatus',
		);
		const insertAt = statusIndex === -1 ? 0 : statusIndex;
		const result = [...items];
		result.splice(insertAt, 0, notice);
		return result;
	});
});
