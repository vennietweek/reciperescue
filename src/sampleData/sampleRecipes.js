const recipes = [
    {
        id: "1",
        title: "Spaghetti Carbonara",
        description: "Indulge in the creamy delight of Spaghetti Carbonara! This classic Italian pasta dish features al dente spaghetti tossed with crispy pancetta, eggs, Parmesan cheese, and a touch of black pepper. The result? A rich and satisfying masterpiece that's ready in no time. Perfect for a quick weeknight dinner or a cozy date night at home. Buon appetito!",
        type: "Lunch",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/33/Espaguetis_carbonara.jpg",
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
        isGlutenFree: false,
        totalCookingTime: 30,
        prepTime: 15,
        cookingTime: 15,
        servingSize: 4,
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
        title: "Chicken Alfredo",
        description: "With just five ingredients, you don’t even have to write out a grocery list for this winner dinner. And yes, thanks to the chicken and Alfredo, it’s every bit as delicious as it sounds.",
        type: "Lunch",
        image: "https://www.foodnetwork.com/content/dam/images/food/fullset/2015/9/15/1/FNK_Chicken-Fettucine-Alfredo_s4x3.jpg",
        ingredients: [
            { id: "1", name: "Cut-up Broccoli" },
            { id: "2", name: "Bite-size Skinless Chicken" },
            { id: "3", name: "Unsalted Butter" },
            { id: "4", name: "Whipping Cream" },
            { id: "5", name: "Grated Parmesan Cheese" }
        ],
        ingredientAmounts: ["100g", "150g", "90g", "1 Cup", "1 1/2 cup"],
        isVegetarian: false,
        isVegan: false,
        isDairyFree: false,
        totalCookingTime: 25,
        prepTime: 20,
        cookingTime: 5,
        servingSize: 4,
        calories: 690,
        instructions: [
            "Boil broccoli for 1.5 to 2 minutes until crisp-tender.",
            "Heat chicken in sauté pan or skillet over medium-high heat.",
            "Cook until no longer pink in center. Remove from heat; set aside.",
            "In a separate saucepan, heat unsalted butter and whipping cream to a simmer. ",
            "Add grated Parmesan cheese and stir until thicken",
            "Stir in broccoli and chicken and serve."
        ],
        tips: ["Server over rice or pasta for a more filling meal", "Avoid using bacon as it's too smoky."]
    },
    {
        id: "3",
        title: "Vegan Pesto Pasta",
        description: "Enjoy a flavorful and creamy pasta dish without dairy or animal products! This Vegan Pesto Pasta features al dente pasta coated in a rich and creamy cashew-based pesto sauce. Tossed with roasted cherry tomatoes and fresh basil, it's a delightful and guilt-free meal that's perfect for vegans and vegetarians.",
        type: "Dinner",
        image: "https://sweetsimplevegan.com/wp-content/uploads/2021/10/Easy-Avocado-Pesto-Pasta-Sweet-Simple-Vegan-2.jpg",
        ingredients: [
            { id: "6", name: "Pasta (gluten-free if needed)" },
            { id: "7", name: "Cashews" },
            { id: "8", name: "Nutritional yeast" },
            { id: "9", name: "Garlic cloves" },
            { id: "10", name: "Basil leaves" },
            { id: "11", name: "Cherry tomatoes" },
            { id: "12", name: "Olive oil" },
            { id: "13", name: "Lemon juice" },
            { id: "14", name: "Salt" },
            { id: "15", name: "Black pepper" }
        ],
        ingredientAmounts: ["250g", "1 cup", "2 tbsp", "2", "1 cup", "200g", "2 tbsp", "2 tbsp", "1/2 tsp", "1/4 tsp"],
        isVegetarian: true,
        isVegan: true,
        isDairyFree: true,
        isGlutenFree: true,
        totalCookingTime: 30,
        prepTime: 15,
        cookingTime: 15,
        servingSize: 4,
        calories: 450,
        instructions: [
            "Cook the pasta until al dente according to package instructions.",
            "While the pasta is cooking, prepare the pesto sauce.",
            "In a food processor, combine cashews, nutritional yeast, garlic cloves, basil leaves, lemon juice, salt, and black pepper.",
            "Blend until you get a creamy pesto sauce. You can adjust the consistency with water if needed.",
            "In a pan, roast cherry tomatoes with olive oil until they blister and burst.",
            "Drain the cooked pasta and return it to the pot.",
            "Add the pesto sauce and roasted cherry tomatoes to the pasta. Mix well to coat the pasta.",
            "Serve hot, garnished with fresh basil leaves and an extra sprinkle of nutritional yeast."
        ],
        tips: ["Soak cashews in hot water for 15 minutes to soften them before blending.", "Adjust the thickness of the pesto sauce with water as desired."]
    },
    {
        id: "4",
        title: "Penne Arrabiata",
        description: "Add a spicy twist to your pasta with this Penne Arrabiata recipe! Al dente penne pasta is tossed in a fiery tomato sauce made with garlic, red pepper flakes, and fresh basil. It's a quick and easy dish that packs a punch of flavor.",
        type: "Dinner",
        image: "https://media.istockphoto.com/id/1193160109/photo/penne-pasta-with-chili-sauce-arrabiata-classic-italian-penne-arrabiata-with-basil-and-freshly.jpg?s=612x612&w=0&k=20&c=NyXLpJ1zD7OCKKvlBLY6qRU4XTl97e1acVzwNDs4UOc=",
        ingredients: [
            { id: "16", name: "Penne pasta" },
            { id: "17", name: "Garlic cloves" },
            { id: "18", name: "Crushed red pepper flakes" },
            { id: "19", name: "Canned crushed tomatoes" },
            { id: "20", name: "Fresh basil leaves" },
            { id: "21", name: "Olive oil" },
            { id: "22", name: "Salt" },
            { id: "23", name: "Black pepper" }
        ],
        ingredientAmounts: ["250g", "3 cloves", "1-2 tsp", "1 can (400g)", "1/2 cup", "2 tbsp", "1/2 tsp", "1/4 tsp"],
        isVegetarian: true,
        isVegan: false,
        isDairyFree: true,
        isGlutenFree: false,
        totalCookingTime: 20,
        prepTime: 10,
        cookingTime: 10,
        servingSize: 4,
        calories: 350,
        instructions: [
            "Cook the penne pasta until al dente according to package instructions.",
            "In a pan, heat olive oil over medium heat. Add crushed garlic and red pepper flakes. Sauté for 1-2 minutes until fragrant.",
            "Add crushed tomatoes, salt, and black pepper to the pan. Simmer for about 10 minutes, or until the sauce thickens.",
            "Stir in fresh basil leaves and cook for an additional 2 minutes.",
            "Drain the cooked penne pasta and add it to the sauce. Toss to coat the pasta in the spicy tomato sauce.",
            "Serve hot and garnish with additional fresh basil if desired."
        ],
        tips: ["Adjust the level of spiciness by adding more or fewer red pepper flakes.", "Top with grated Parmesan cheese for extra flavor."]
    },
    {
        id: "5",
        title: "Gluten-Free Quinoa Salad",
        description: "Enjoy a delicious and healthy gluten-free meal with this Quinoa Salad! Packed with fresh vegetables, protein-rich quinoa, and a zesty lemon dressing, it's perfect for those with gluten sensitivities.",
        type: "Lunch",
        image: "https://sweetsimplevegan.com/wp-content/uploads/2023/02/horizontal_photo_Vegan_quinoa_salad_recipe_sweet_simple_vegan_1.jpg",
        ingredients: [
            { id: "24", name: "Quinoa" },
            { id: "25", name: "Cherry tomatoes" },
            { id: "26", name: "Cucumber" },
            { id: "27", name: "Red bell pepper" },
            { id: "28", name: "Red onion" },
            { id: "29", name: "Fresh parsley" },
            { id: "30", name: "Lemon juice" },
            { id: "31", name: "Olive oil" },
            { id: "32", name: "Salt" },
            { id: "33", name: "Black pepper" }
        ],
        ingredientAmounts: ["1 cup", "1 cup", "1/2 cucumber", "1/2 red bell pepper", "1/4 red onion", "1/4 cup", "2 tbsp", "2 tbsp", "1/2 tsp", "1/4 tsp"],
        isVegetarian: true,
        isVegan: true,
        isDairyFree: true,
        isGlutenFree: true,
        totalCookingTime: 25,
        prepTime: 15,
        cookingTime: 10,
        servingSize: 4,
        calories: 250,
        instructions: [
            "Rinse quinoa under cold water. In a saucepan, bring 2 cups of water to a boil, add quinoa, reduce heat to low, and cover. Cook for 15 minutes, or until water is absorbed and quinoa is fluffy.",
            "Chop cherry tomatoes, cucumber, red bell pepper, red onion, and fresh parsley.",
            "In a large bowl, combine cooked quinoa and chopped vegetables.",
            "In a small bowl, whisk together lemon juice, olive oil, salt, and black pepper to make the dressing.",
            "Pour the dressing over the quinoa salad and toss to coat everything evenly.",
            "Serve chilled and enjoy your gluten-free quinoa salad!"
        ],
        tips: ["You can add your favorite protein, like grilled chicken or chickpeas, for extra substance.", "Feel free to customize with your favorite veggies."]
    }
]

export default recipes;