<script lang="ts">
	interface Props {
		title?: string;
		account?: string;
		errorCode?: string;
		errorNumber?: string | number;
		message: string;
	}

	let {
		title = 'Error',
		account,
		errorCode,
		errorNumber,
		message
	}: Props = $props();
</script>

<div class="my-6 overflow-hidden rounded-lg border-l-4 border-red-500 bg-red-50">
	<div class="px-6 py-4">
		<div class="flex items-start">
			<div class="flex-shrink-0">
				<span class="text-2xl">❌</span>
			</div>
			<div class="ml-4 flex-1">
				<h3 class="text-lg font-semibold text-red-900" style="font-family: 'Inter', sans-serif;">
					{title}
				</h3>
				<div class="mt-3 space-y-2 font-mono text-sm text-red-800">
					{#if account}
						<div class="flex">
							<span class="font-semibold min-w-[140px]">Account:</span>
							<span class="text-red-700">{account}</span>
						</div>
					{/if}
					{#if errorCode}
						<div class="flex">
							<span class="font-semibold min-w-[140px]">Error Code:</span>
							<span class="text-red-700">{errorCode}</span>
						</div>
					{/if}
					{#if errorNumber}
						<div class="flex">
							<span class="font-semibold min-w-[140px]">Error Number:</span>
							<span class="text-red-700">{errorNumber}</span>
						</div>
					{/if}
					<div class="flex flex-col mt-3 pt-3 border-t border-red-200">
						<span class="font-semibold mb-1">Message:</span>
						<span class="text-red-700 italic">{message}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
