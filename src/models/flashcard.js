import { z } from 'zod'

export const createFlashcardSchema = z.object({
    collection_id: z.string().uuid("L'ID de la collection doit être un UUID valide"),
    frontText: z.string().min(1, "Le texte recto est requis").max(255, "Le texte recto ne peut pas dépasser 255 caractères"),
    backText: z.string().min(1, "Le texte verso est requis").max(255, "Le texte verso ne peut pas dépasser 255 caractères"),
    frontUrl: z.string().url("L'URL recto doit être une URL valide").optional().or(z.literal('')),
    backUrl: z.string().url("L'URL verso doit être une URL valide").optional().or(z.literal(''))
})

export const updateFlashcardSchema = z.object({
    frontText: z.string().min(1, "Le texte recto est requis").max(255, "Le texte recto ne peut pas dépasser 255 caractères").optional(),
    backText: z.string().min(1, "Le texte verso est requis").max(255, "Le texte verso ne peut pas dépasser 255 caractères").optional(),
    frontUrl: z.string().url("L'URL recto doit être une URL valide").optional().or(z.literal('')),
    backUrl: z.string().url("L'URL verso doit être une URL valide").optional().or(z.literal(''))
})

export const flashcardIdSchema = z.object({
    id: z.string().uuid("L'ID doit être un UUID valide")
})

export const collectionIdSchema = z.object({
    collectionId: z.string().uuid("L'ID de la collection doit être un UUID valide")
})