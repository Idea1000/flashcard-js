import { db } from "./database.js"

async function seed() {
    try{
        console.log("Seeding database ...")

        // Insert data in table here

        console.log("Database seeded successfully")
    }catch(error){
        console.log("Error seeding database", error)
    }
}

seed()