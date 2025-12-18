import z from "zod";

/**
 * Schema for user or admin registration validation.
 */
export const registerSchema = z.object({
    email: z.email(),
    name: z.string().max(30).min(3),
    firstname: z.string().max(30).min(3),
    password: z.string().min(8).max(255)
})

/**
 * Schema for user or admin login validation.
 */
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(255)
})