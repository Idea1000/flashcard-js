import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { randomUUID } from 'crypto'

export const levelsTable = sqliteTable('levels', {
    level: integer()
        .primaryKey(),
    delay: integer({length: 300}).notNull()
})

export const revisionsTable = sqliteTable('revisions', {
    id: text()
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    userId: text('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
    flashcardId: text('flashcard_id').references(() => flashcardsTable.id, { onDelete: 'cascade' }),
    level: integer().references(() => levelsTable.level, { onDelete: 'cascade' }),
    lastRevision: integer('last_revision', {mode: 'timestamp'})
})

export const usersTable = sqliteTable('users', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    email: text().notNull().unique(),
    name: text({ length: 30}),
    firstname: text({ length: 30}),
    password: text({ length: 255 }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date),
    role: text({ length: 20, enum: ["USER", "ADMIN"] }).$defaultFn(() => "USER"),
})

export const flashcardsTable = sqliteTable('flashcards', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    collection_id: text().notNull().references(() => collectionsTable.id, { onDelete: 'cascade' }),
    frontText: text('front_text', { length: 30}),
    backText: text('back_text', { length: 30}),
    frontUrl: text('front_url', { length: 30}),
    backUrl: text('back_url', { length: 30}),
})

export const collectionsTable = sqliteTable('collections', {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    creatorId: text('creator_id').references(() => usersTable.id, { onDelete: 'cascade' }),
    title: text({ length: 50}),
    description: text({ length: 200}),
    visibility: text({ length: 20, enum: ["PUBLIC", "PRIVATE"] }).$defaultFn(() => "PUBLIC"),
})