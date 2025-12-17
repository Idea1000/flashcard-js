import z from "zod";

export const createCollection = z.object({
    title: z.string().min(1).max(50),
    description: z.string().min(0).max(200).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
})

export const updateCollection = z.object({
    title: z.string().min(1).max(50).optional(),
    description: z.string().min(0).max(200).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
})