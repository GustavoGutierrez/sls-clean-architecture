import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email('Formato de correo electronico invalido.').min(1),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.')
});

export type Login = z.infer<typeof LoginSchema>;
