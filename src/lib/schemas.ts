
import { z } from 'zod'

export const formSchema = z
	.object({
		userName: z
			.string({ required_error: 'Username is required' })
			.trim()
			.min(1, 'Username is required')
			.min(3, 'Username must be at least 3 characters'),
		firstName: z
			.string({ required_error: 'First name is required' })
			.trim()
			.min(1, 'First name is required')
			.min(3, 'First name must be at least 3 characters'),
		lastName: z
			.string({ required_error: 'Last name is required' })
			.trim()
			.min(1, 'First name is required')
			.min(3, 'Last name must be at least 3 characters'),
		email: z
			.string({ required_error: 'Last name is required' })
			.trim()
			.min(1, 'Email is required')
			.email('Email must be a valid email address'),
		password: z
			.string({ required_error: 'Password is required' })
			.trim()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
				'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
			),
		passwordConfirm: z
			.string({ required_error: 'Password confirmation is required' })
			.trim()
			.min(1, 'Password confirmation is required'),
		agree: z.enum(['on'], { required_error: 'You must agree to the terms and conditions' }),
	})
	.superRefine(({ password, passwordConfirm }, ctx) => {
		if (password !== passwordConfirm)
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Passwords do not match', path: ['passwordConfirm'] })
	})

export type FormType = z.infer<typeof formSchema>