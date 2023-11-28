import z from 'zod';

export interface LikePostInputDTO {
	id: string;
	token: string;
	like: boolean;
}

export const likePostChema = z.object({
	id: z.string().min(1, { message: 'Id inválido' }),
	token: z.string().min(1, { message: 'Token inválido' }),
	like: z.boolean(),
});
