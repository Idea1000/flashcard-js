import { db } from "./database.js"
import { levelsTable } from "./schema.js"

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

        console.log("Database seeded successfully")
    }catch(error){
        console.log("Error seeding database", error)
    }
}

seed()