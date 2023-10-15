import '../App.css';
import Navbar from '../Navbar.js';
import 'font-awesome/css/font-awesome.min.css';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/recipeInfo.css';
import { RecipeInfo } from '../containers/RecipeInfo.jsx';
import { RecipeIngredients } from '../containers/RecipeIngredients.jsx';
import { RecipeInstructions } from '../containers/RecipeInstructions.jsx';
import { RecipeNutrition } from '../containers/RecipeNutrition.jsx';

const recipe1 = 
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

const recipe2 = 
    {
        id: "2",
        title: "Chicken Alfredo",
        description: "With just five ingredients, you don’t even have to write out a grocery list for this winner dinner. And yes, thanks to the chicken and Alfredo, it’s every bit as delicious as it sounds.",
        image: "https://hips.hearstapps.com/hmg-prod/images/delish-221130-perfect-chicken-alfredo-0689-eb-1670449996.jpg",
        ingredients: [
            { id: "1", name: "Cut-up Broccoli" },
            { id: "2", name: "Bite-size Skinless Chicken" },
            { id: "3", name: "Unsalted Butter" },
            { id: "4", name: "Whipping Cream" },
            { id: "5", name: "Grated Parmesan Chee" }
        ],
        ingredientAmounts: ["100g", "150g", "90g", "1 Cup", "1 1/2 cup"],
        isVegetarian: false,
        isVegan: false,
        isDairyFree: false,
        totalCookingTime: 25,
        prepTime: 20,
        cookingTime: 5,
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
    }

const recipeList = [ {id: '1', recipe:recipe1 }, {id: '2', recipe:recipe2 } ]


export function RecipeInfoPage (){
    const { id } = useParams();
    for (var i = 0; i < recipeList.length; i++){
        if (recipeList[i].id === id){
            var recipe = recipeList[i].recipe;
        }
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