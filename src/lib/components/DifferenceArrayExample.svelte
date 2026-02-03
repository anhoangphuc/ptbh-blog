<script lang="ts">
	interface Operation {
		description: string;
		lowerBound: number;
		upperBound: number;
		value: number;
	}

	let {
		arraySize = 10,
		operations,
		title = 'Example',
		gradientFrom = 'blue-50',
		gradientTo = 'indigo-50'
	}: {
		arraySize?: number;
		operations: Operation[];
		title?: string;
		gradientFrom?: string;
		gradientTo?: string;
	} = $props();

	const deltaArray = $derived.by(() => {
		const deltas = new Array(arraySize).fill(0);
		for (const op of operations) {
			deltas[op.lowerBound] += op.value;
			if (op.upperBound < arraySize) {
				deltas[op.upperBound] -= op.value;
			}
		}
		return deltas;
	});

	const finalArray = $derived.by(() => {
		const result = new Array(arraySize).fill(0);
		let accumulated = 0;
		for (let i = 0; i < arraySize; i++) {
			accumulated += deltaArray[i];
			result[i] = accumulated;
		}
		return result;
	});

	const formatDelta = (value: number) => {
		if (value > 0) return `+${value}`;
		if (value < 0) return `${value}`;
		return '0';
	};
</script>

<div class="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
	<div
		class="border-b border-slate-200 px-6 py-4 {gradientFrom === 'blue-50' &&
		gradientTo === 'indigo-50'
			? 'bg-gradient-to-r from-blue-50 to-indigo-50'
			: 'bg-gradient-to-r from-purple-50 to-pink-50'}"
	>
		<h3 class="text-lg font-bold text-slate-900" style="font-family: 'Playfair Display', serif;">
			{title}
		</h3>
	</div>
	<div class="px-6 py-4">
		<p class="mb-3 font-semibold text-slate-900">Operations:</p>
		<ol class="mb-6 list-inside list-decimal space-y-2 text-sm">
			{#each operations as op}
				<li>
					{op.description}:
					<span class="font-mono text-purple-700">[{op.lowerBound}, {op.upperBound})</span>
					{#if op.value > 0}
						<span class="text-green-700">+{op.value}</span>
					{:else}
						<span class="text-red-700">{op.value}</span>
					{/if}
				</li>
			{/each}
		</ol>

		<div class="mb-4 rounded-lg bg-slate-50 p-4">
			<p class="mb-3 font-semibold text-slate-900">Delta Array (boundary changes):</p>
			<p class="mb-3 text-sm text-slate-600">Only store what changes at each boundary:</p>
			<div class="mb-3 grid grid-cols-10 gap-1 font-mono text-xs">
				{#each deltaArray as delta, i}
					<div
						class="rounded p-2 text-center {delta !== 0
							? 'border border-purple-300 bg-purple-100 font-semibold'
							: 'border border-slate-200 bg-white'}"
					>
						<div class="text-slate-500">[{i}]</div>
						<div
							class={delta > 0 ? 'text-green-700' : delta < 0 ? 'text-red-700' : 'text-slate-400'}
						>
							{formatDelta(delta)}
						</div>
					</div>
				{/each}
			</div>
			<p class="text-xs text-slate-600">
				Each operation only modifies 2 positions: the start and end boundaries.
			</p>
		</div>

		<div class="rounded-lg border border-green-200 bg-green-50 p-4">
			<p class="mb-3 font-semibold text-green-900">Final Array (accumulated values):</p>
			<p class="mb-3 text-sm text-green-700">
				Accumulate deltas from left to right to get actual values:
			</p>
			<div class="mb-3 grid grid-cols-10 gap-1 font-mono text-xs">
				{#each finalArray as value, i}
					<div
						class="rounded p-2 text-center {value !== 0
							? 'border border-green-300 bg-green-100 font-semibold text-green-800'
							: 'border border-slate-200 bg-white text-slate-400'}"
					>
						<div class="text-slate-500">[{i}]</div>
						<div>{value}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
