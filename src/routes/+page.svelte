<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import Error from '$lib/components/Error.svelte'
	import Field from '$lib/components/Field.svelte'
	import { formSchema, type FormType } from '$lib/schemas'
	import autoAnimate from '@formkit/auto-animate'
	import { onMount } from 'svelte'
	import type { z } from 'zod'
	import type { ActionData } from './$types'

	export let form: ActionData

	let formElement: HTMLFormElement
	let touched: Record<string, HTMLInputElement> = {}
	let init = false
	$: success = !!(form && form.success)
	$: if (success) {
		setTimeout(() => {
			formElement?.reset()
			touched = {}
			requestSubmit()
		}, 5000)
	}

	const getFormValue = (field: keyof NonNullable<NonNullable<ActionData>['data']>) => {
		return form?.data?.[field] ?? ''
	}

	$: getFieldErrors = (field: keyof NonNullable<NonNullable<ActionData>['errors']>) => {
		if (!!(form?.errors?.[field] && (!init || touched[field]))) return form.errors[field]?.[0]
	}

	$: fields = (
		[
			{
				name: 'firstName',
				type: 'text',
				label: 'First Name',
			},
			{
				name: 'lastName',
				type: 'text',
				label: 'Last Name',
			},
			{
				name: 'userName',
				type: 'text',
				label: 'Username',
			},
			{ name: 'email', type: 'text', label: 'Email' },
			{
				name: 'password',
				type: 'password',
				label: 'Password',
			},
			{
				name: 'passwordConfirm',
				type: 'password',
				label: 'Password Confirmation',
			},
		] as const
	).map((field) => ({ ...field, value: getFormValue(field.name), error: getFieldErrors(field.name) }))

	const requestSubmit = () => formElement.requestSubmit()
	const addTouched = (target: HTMLInputElement) => {
		if (target?.name) touched[target.name] = target
	}

	const blurHandler = (e: Event) => {
		const target = e.target as HTMLInputElement
		requestSubmit()
		addTouched(target)
	}

	const inputHandler = (e: Event) => {
		const target = e.target as HTMLInputElement
		requestSubmit()
		addTouched(target)
	}

	const formEnhance = (({ action, data, cancel }) => {
		const formData = Object.fromEntries(data)
		try {
			const parsedForm = formSchema.parse(formData)
			if (parsedForm && action.searchParams.get('submit')) form = { data: formData, success: true }
			else form = { data: formData, success: false }
		} catch (error) {
			form = {
				data: formData,
				errors: (<z.ZodError<FormType>>error).flatten().fieldErrors,
			}
		}
		cancel()
	}) satisfies SubmitFunction

	onMount(() => {
		init = true
		const inputs = formElement.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]')
		inputs.forEach((input) => {
			input.addEventListener('blur', blurHandler)
		})

		return () => {
			inputs.forEach((input) => {
				input.removeEventListener('blur', blurHandler)
			})
		}
	})
</script>

<div
	class="absolute top-0 flex w-full h-12 font-bold text-white justify-center items-center transition-all bg-green-500"
	style:--logged={success ? 0 : 1}
>
	User Created
</div>

<form
	class="grid grid-cols-1 content-center justify-items-start gap-4 w-1/4"
	method="post"
	action="?/login"
	use:enhance={formEnhance}
	use:autoAnimate
	bind:this={formElement}
	on:input={inputHandler}
	on:change={requestSubmit}
>
	{#each fields as field}
		<Field {...field} bind:error={field.error} />
	{/each}
	<label class="label gap-2 w-full" for="agree">
		<span class="label-text">I agree to the terms and conditions</span>
		<input
			class="checkbox checkbox-success"
			class:input-error={getFieldErrors('agree')}
			checked={!!getFormValue('agree')}
			id="agree"
			name="agree"
			type="checkbox"
		/>
	</label>
	<Error error={getFieldErrors('agree')} />
	<button
		formaction="?/login&submit=true"
		disabled={init && !!(!Object.values(touched).length || form?.errors)}
		class="btn justify-self-end"
		type="submit">Register</button
	>
</form>

<style>
	div {
		transform: translateY(calc(-100% * var(--logged)));
		opacity: calc(1 - var(--logged));
	}

	:global(input),
	:global(label) {
		@apply transition-all;
	}
</style>
