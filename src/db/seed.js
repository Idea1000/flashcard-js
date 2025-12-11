import { db } from "./database.js"
import { levelsTable, usersTable } from "./schema.js"
import bcrypt from "bcrypt"

async function seed() {
    try{
        console.log("Seeding database ...")

        // Reset level table

        await db.delete(levelsTable)

        const seedLevels = [
            {
                "level": "1",
                "delay": "1"
            },
            {
                "level": "2",
                "delay": "2"
            },
            {
                "level": "3",
                "delay": "4"
            },
            {
                "level": "4",
                "delay": "8"
            },
            {
                "level": "5",
                "delay": "16"
            },
        ]

        await db
            .insert(levelsTable)
            .values(seedLevels)
            .returning()


        await db.delete(usersTable)

        const seedUsers = [
            {
                "email": "admin@admin.com",
                "name": "admin",
                "firstname": "admin",
                "password": await bcrypt.hash("adminpassword", 12),
                "role": "ADMIN"
            },
            {
                "email": "user@user.com",
                "name": "user",
                "firstname": "user",
                "password": await bcrypt.hash("userpassword", 12),
                "role": "USER"
            },
        ]

        await db
            .insert(usersTable)
            .values(seedUsers)
            .returning()

        console.log("Database seeded successfully")
    }catch(error){
        console.log("Error seeding database", error)
    }
}

seed()