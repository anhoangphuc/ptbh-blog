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

<div class="my-8 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-lg">
	<div
		class="border-b border-slate-200 px-6 py-4 {gradientFrom === 'blue-50' && gradientTo === 'indigo-50'
			? 'bg-gradient-to-r from-blue-50 to-indigo-50'
			: 'bg-gradient-to-r from-purple-50 to-pink-50'}"
	>
		<h3 class="text-lg font-bold text-slate-900" style="font-family: 'Playfair Display', serif;">
			{title}
		</h3>
	</div>
	<div class="px-6 py-4">
		<p class="font-semibold text-slate-900 mb-3">Operations:</p>
		<ol class="list-decimal list-inside space-y-2 text-sm mb-6">
			{#each operations as op}
				<li>
					{op.description}:
					<span class="font-mono text-purple-700"
						>[{op.lowerBound}, {op.upperBound})</span
					>
					{#if op.value > 0}
						<span class="text-green-700">+{op.value}</span>
					{:else}
						<span class="text-red-700">{op.value}</span>
					{/if}
				</li>
			{/each}
		</ol>

		<div class="bg-slate-50 p-4 rounded-lg mb-4">
			<p class="font-semibold text-slate-900 mb-3">Delta Array (boundary changes):</p>
			<p class="text-sm text-slate-600 mb-3">Only store what changes at each boundary:</p>
			<div class="grid grid-cols-10 gap-1 text-xs font-mono mb-3">
				{#each deltaArray as delta, i}
					<div
						class="p-2 rounded text-center {delta !== 0
							? 'bg-purple-100 border border-purple-300 font-semibold'
							: 'bg-white border border-slate-200'}"
					>
						<div class="text-slate-500">[{i}]</div>
						<div class={delta > 0 ? 'text-green-700' : delta < 0 ? 'text-red-700' : 'text-slate-400'}>
							{formatDelta(delta)}
						</div>
					</div>
				{/each}
			</div>
			<p class="text-xs text-slate-600">
				Each operation only modifies 2 positions: the start and end boundaries.
			</p>
		</div>

		<div class="bg-green-50 p-4 rounded-lg border border-green-200">
			<p class="font-semibold text-green-900 mb-3">Final Array (accumulated values):</p>
			<p class="text-sm text-green-700 mb-3">
				Accumulate deltas from left to right to get actual values:
			</p>
			<div class="grid grid-cols-10 gap-1 text-xs font-mono mb-3">
				{#each finalArray as value, i}
					<div
						class="p-2 rounded text-center {value !== 0
							? 'bg-green-100 border border-green-300 font-semibold text-green-800'
							: 'bg-white border border-slate-200 text-slate-400'}"
					>
						<div class="text-slate-500">[{i}]</div>
						<div>{value}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
