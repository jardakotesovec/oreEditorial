<template>
	<div v-if="shouldShow" class="ore-editorial-notice border border-light p-4">
		<p class="text-sm-normal">
			{{ t('plugins.generic.oreEditorial.criteriaMet') }}
		</p>
	</div>
</template>

<script setup>
import {computed} from 'vue';

const {useLocalize} = pkp.modules.useLocalize;
const {t} = useLocalize();

const props = defineProps({
	submission: {type: Object, required: true},
	selectedReviewRoundId: {type: Number, default: null},
});

// ReviewerRecommendationType enum values (see lib/pkp/.../enums/ReviewerRecommendationType.php)
const TYPE_APPROVED = 1;
const TYPE_REVISIONS_REQUESTED = 3;

// ReviewAssignment::REVIEW_ASSIGNMENT_STATUS_COMPLETE / _THANKED — "confirmed by editor"
const CONFIRMED_STATUSES = [8, 9];

const isVorPublished = computed(() =>
	(props.submission?.publications ?? []).some(
		(pub) =>
			pub.versionStage === 'VoR' &&
			pub.status === pkp.const.publication.STATUS_PUBLISHED,
	),
);

const counts = computed(() => {
	const result = {approved: 0, revisionsRequested: 0};
	if (!props.selectedReviewRoundId) return result;

	for (const ra of props.submission?.reviewAssignments ?? []) {
		if (ra.roundId !== props.selectedReviewRoundId) continue;
		if (!CONFIRMED_STATUSES.includes(ra.statusId)) continue;

		if (ra.reviewerRecommendationType === TYPE_APPROVED) {
			result.approved++;
		} else if (ra.reviewerRecommendationType === TYPE_REVISIONS_REQUESTED) {
			result.revisionsRequested++;
		}
	}
	return result;
});

const criteriaMet = computed(() => {
	const {approved, revisionsRequested} = counts.value;
	return approved >= 2 || (approved >= 1 && revisionsRequested >= 2);
});

const shouldShow = computed(() => criteriaMet.value && !isVorPublished.value);
</script>

<style scoped>
.ore-editorial-notice {
	margin-bottom: var(--spacing-4);
}
</style>
