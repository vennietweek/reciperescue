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


const recipe = 
    {
        id: "1",
        title: "Spaghetti Carbonara",
        description: "Indulge in the creamy delight of Spaghetti Carbonara! This classic Italian pasta dish features al dente spaghetti tossed with crispy pancetta, eggs, Parmesan cheese, and a touch of black pepper. The result? A rich and satisfying masterpiece that's ready in no time. Perfect for a quick weeknight dinner or a cozy date night at home. Buon appetito!",
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
    }

export function RecipeInfoPage (){
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
