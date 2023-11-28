import z from 'zod';

export interface SignupInputDTO {
	name: string;
	email: string;
	password: string;
}

export const signupSchema = z
	.object({
		name: z
			.string()
			.min(2, { message: 'O nome deve conter 2 caracteres ou mais' }),
		email: z.string().email({ message: 'Email inválido' }),
		password: z
			.string()
			.min(4, { message: 'A senha deve conter 4 caracteres ou mais' }),
	})
	.transform((data) => data as SignupInputDTO);
