import '../App.css';
import Navbar from '../Navbar.js';
import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import '../styles/recipeInfo.css';
import { useParams } from 'react-router-dom';
import { RecipeInfo } from '../containers/RecipeInfo.jsx';
import { RecipeIngredients } from '../containers/RecipeIngredients.jsx';
import { RecipeInstructions } from '../containers/RecipeInstructions.jsx';
import { RecipeNutrition } from '../containers/RecipeNutrition.jsx';
import { RecipeTips } from '../containers/RecipeTips.jsx'
import recipes from '../sampleData/sampleRecipes.js';

export function RecipeInfoPage (){
    let { id } = useParams();
    const recipe = recipes.find(recipes => recipes.id === id);
    if (!recipe) {
        return <div>To be linked in the future</div>;
    }
    return(
        <>
        <div className='recipe-information-page'>
            <Navbar />
            <RecipeInfo recipe={recipe} />
            <RecipeIngredients ingredients={recipe.ingredients} ingredientAmounts={recipe.ingredientAmounts} />
            <RecipeInstructions instructions={recipe.instructions} />
            <RecipeTips tips={recipe.tips} />
        </div>
        </>
    )
  }