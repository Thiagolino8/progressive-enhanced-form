import type { Actions } from '@sveltejs/kit'
import type { z } from 'zod'
import { formSchema, type FormType } from '$lib/schemas'

export const actions: Actions = {
	login: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData())
		try {
			const form = formSchema.parse(formData)
			if (form) return { data: formData, success: true }
		} catch (error) {
			return {
				data: formData,
				errors: (<z.ZodError<FormType>>error).flatten().fieldErrors,
			}
		}
	},
}
