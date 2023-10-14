// This script is for populating the Recipes collection with some sample recipes
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://mcomp5007:ICEmilo2023@cluster0.usczdrl.mongodb.net/?retryWrites=true&w=majority";  // replace with your URI from MongoDB Atlas
const client = new MongoClient(uri);

const sampleRecipes = [
    {
        id: "1",
        title: "Spaghetti Carbonara",
        image: "spaghetti-carbonara.jpg",
        ingredients: [
            { id: "1", name: "Spaghetti" },
            { id: "2", name: "Eggs" },
            { id: "3", name: "Pecorino cheese" },
            { id: "4", name: "Guanciale" },
            { id: "5", name: "Black pepper" }
        ],
        ingredientAmounts: ["200g", "2", "50g", "100g", "1 tsp"],
        isVegetarian: false,
        isVegan: false,
        isDairyFree: false,
        totalCookingTime: 30,
        prepTime: 15,
        cookingTime: 15,
        calories: 600,
        instructions: [
            "Boil the spaghetti until al dente.",
            "In a bowl, whisk eggs and mix with cheese.",
            "Cook guanciale in a pan until crisp.",
            "Add spaghetti to pan with guanciale.",
            "Remove from heat, and quickly mix in egg and cheese mixture.",
            "Serve immediately with a sprinkle of black pepper."
        ],
        tips: ["Use fresh eggs for a creamy sauce.", "Avoid using bacon as it's too smoky."]
    },
    {
        id: "2",
        title: "Vegan Chickpea Curry",
        image: "chickpea-curry.jpg",
        ingredients: [
            { id: "6", name: "Chickpeas" },
            { id: "7", name: "Coconut milk" },
            { id: "8", name: "Curry powder" },
            { id: "9", name: "Onion" },
            { id: "10", name: "Tomatoes" }
        ],
        ingredientAmounts: ["200g", "400ml", "2 tbsp", "1", "2"],
        isVegetarian: true,
        isVegan: true,
        isDairyFree: true,
        totalCookingTime: 40,
        prepTime: 10,
        cookingTime: 30,
        calories: 550,
        instructions: [
            "Sauté onions until translucent.",
            "Add curry powder and fry for a minute.",
            "Add chickpeas and tomatoes.",
            "Pour in coconut milk and let simmer for 30 minutes.",
            "Serve with rice."
        ],
        tips: ["Use freshly ground spices for better flavor.", "Can be stored in the fridge for up to 3 days."]
    },
    {
        id: "3",
        title: "Vegetable Stir Fry",
        image: "veg-stir-fry.jpg",
        ingredients: [
            { id: "11", name: "Bell peppers" },
            { id: "12", name: "Broccoli" },
            { id: "13", name: "Carrots" },
            { id: "14", name: "Soy sauce" },
            { id: "15", name: "Garlic" }
        ],
        ingredientAmounts: ["2", "1 cup", "2", "3 tbsp", "2 cloves"],
        isVegetarian: true,
        isVegan: true,
        isDairyFree: true,
        totalCookingTime: 20,
        prepTime: 10,
        cookingTime: 10,
        calories: 250,
        instructions: [
            "Chop vegetables into bite-sized pieces.",
            "Heat oil in a pan and sauté garlic.",
            "Add vegetables and stir fry for 7 minutes.",
            "Add soy sauce and stir well.",
            "Serve hot with noodles or rice."
        ],
        tips: ["Don’t overcook the veggies to retain a crunch.", "Can add tofu for protein."]
    }
]

async function insertData() {
    console.log("Starting the script...");

    try {
        await client.connect();
        const collection = client.db("recipeRescue").collection("recipes");

        const response = await collection.insertMany(sampleRecipes);
        console.log('Sample recipes inserted:', response.insertedCount);

    } catch (error) {
        console.error('Failed to insert sample recipes:', error);
    } finally {
        await client.close();
        console.log("Data insertion complete and connection closed.");
    }
}

insertData();