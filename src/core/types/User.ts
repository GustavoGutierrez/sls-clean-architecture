import * as z from 'zod';

const phoneNumberRegex = /^\+?[0-9]{10,15}$/;

export const UserSchema = z.object({
    email: z.string().email(),
    fullname: z.string().min(1),
    password: z.string().min(1).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un caracter especial'),
    phone: z.string().regex(phoneNumberRegex).optional(),
    verification_code: z.string().default('').optional(),
    verified: z.boolean().default(false).optional(),
    realm: z.enum(['user', 'admin']).default('user'),
    avatar: z.string().default('').optional(),
    active: z.boolean().default(true).optional(),
    created: z.string().optional(),
});

export const JWTPayloadSchema = z.object({
    iat: z.number(),
    aud: z.string(),
    sub: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export type AuthUser =  JWTPayload & User;



