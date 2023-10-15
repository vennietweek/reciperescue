import '../App.css';
import Navbar from '../Navbar.js';
import 'font-awesome/css/font-awesome.min.css';
import React, { useState } from 'react';
import '../styles/recipeInfo.css';
import { useParams } from 'react-router-dom';
import { RecipeInfo } from '../containers/RecipeInfo.jsx';
import { RecipeIngredients } from '../containers/RecipeIngredients.jsx';
import { RecipeInstructions } from '../containers/RecipeInstructions.jsx';
import { RecipeNutrition } from '../containers/RecipeNutrition.jsx';

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
        title: "Vegan Pesto Pasta",
        description: "Enjoy a flavorful and creamy pasta dish without dairy or animal products! This Vegan Pesto Pasta features al dente pasta coated in a rich and creamy cashew-based pesto sauce. Tossed with roasted cherry tomatoes and fresh basil, it's a delightful and guilt-free meal that's perfect for vegans and vegetarians.",
        type: "Dinner",
        image: "https://cdn77-s3.lazycatkitchen.com/wp-content/uploads/2018/04/vegan-pesto-pasta-bowl-800x1200.jpg",
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
    }
];



export function RecipeInfoPage (){
    let { recipeId } = useParams();
    const recipe = recipes.find((recipe) => recipe.id === String(recipeId));
    if (!recipe) {
        return <div>Recipe not found</div>;
      }
    return(
        <>
        <div className='recipe-information-page'>
            <Navbar />
            <RecipeInfo recipe={recipe} />
            <RecipeIngredients ingredients={recipe.ingredients} ingredientAmounts={recipe.ingredientAmounts} />
            <RecipeInstructions instructions={recipe.instructions} />
        </div>
        </>
    )
  }
