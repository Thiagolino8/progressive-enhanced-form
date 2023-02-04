<script lang="ts">
	import Error from './Error.svelte'

	export let value: FormDataEntryValue
	export let error: string | undefined
	export let name: string
	export let label: string
	export let type: HTMLInputElement['type'] = 'text'
</script>

<div class="form-control w-full">
	<label id="{name}-label" class:text-error={error} for={name}>{label}</label>
	<input
		on:change
		class="input input-bordered w-full"
		class:input-error={error}
		id={name}
		aria-labelledby="{name}-label"
		required={false}
		{name}
		{value}
		{type}
	/>
</div>
<Error {error} />
