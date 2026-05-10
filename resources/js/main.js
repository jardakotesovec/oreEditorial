import OreReviewCriteriaMet from './Components/OreReviewCriteriaMet.vue';

pkp.registry.registerComponent('OreReviewCriteriaMet', OreReviewCriteriaMet);

// ReviewerRecommendationType enum values (see lib/pkp/.../enums/ReviewerRecommendationType.php)
const TYPE_APPROVED = 1;
const TYPE_REVISIONS_REQUESTED = 3;

// ReviewAssignment::REVIEW_ASSIGNMENT_STATUS_COMPLETE / _THANKED — "confirmed by editor"
const CONFIRMED_STATUSES = [8, 9];

function shouldReplaceStatus(submission, selectedReviewRoundId) {
	if (!selectedReviewRoundId) return false;

	const vorPublished = (submission?.publications ?? []).some(
		(pub) =>
			pub.versionStage === 'VoR' &&
			pub.status === pkp.const.publication.STATUS_PUBLISHED,
	);
	if (vorPublished) return false;

	let approved = 0;
	let revisionsRequested = 0;
	for (const ra of submission?.reviewAssignments ?? []) {
		if (ra.roundId !== selectedReviewRoundId) continue;
		if (!CONFIRMED_STATUSES.includes(ra.statusId)) continue;

		if (ra.reviewerRecommendationType === TYPE_APPROVED) {
			approved++;
		} else if (ra.reviewerRecommendationType === TYPE_REVISIONS_REQUESTED) {
			revisionsRequested++;
		}
	}

	return approved >= 2 || (approved >= 1 && revisionsRequested >= 2);
}

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

		if (!shouldReplaceStatus(args.submission, args.selectedReviewRound?.id)) {
			return items;
		}

		const statusIndex = items.findIndex(
			(item) => item.component === 'WorkflowSubmissionStatus',
		);
		if (statusIndex === -1) {
			return items;
		}

		const result = [...items];
		result[statusIndex] = {
			component: 'OreReviewCriteriaMet',
			props: {
				submission: args.submission,
				roundNumber: args.selectedReviewRound?.round ?? null,
			},
		};
		return result;
	});
});
