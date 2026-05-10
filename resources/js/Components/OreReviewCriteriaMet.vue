<template>
	<div class="border border-light p-4">
		<h3 class="mb-2 text-lg-bold text-heading">
			{{ heading }}
		</h3>
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
	roundNumber: {type: Number, default: null},
});

const heading = computed(() =>
	props.roundNumber
		? t('notification.type.roundStatusTitle', {round: props.roundNumber})
		: t('common.status'),
);
</script>
