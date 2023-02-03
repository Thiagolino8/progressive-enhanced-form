<script lang="ts">
  import { fade } from "svelte/transition"

	export let error: string | undefined
</script>

{#if error}
	<p transition:fade class="text-error" style:margin-top="-1rem">{error}</p>
{/if}
