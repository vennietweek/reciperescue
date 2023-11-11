import '../App.css';
import Navbar from '../Navbar.js';
import 'font-awesome/css/font-awesome.min.css';
import React, { useState, useEffect } from 'react';
import '../styles/recipeInfo.css';
import { useParams } from 'react-router-dom';
import { RecipeInfo } from '../containers/RecipeInfo.jsx';
import { RecipeIngredients } from '../containers/RecipeIngredients.jsx';
import { RecipeInstructions } from '../containers/RecipeInstructions.jsx';
import { RecipeNutrition } from '../containers/RecipeNutrition.jsx';
import { RecipeTips } from '../containers/RecipeTips.jsx'
import recipes from '../sampleData/sampleRecipes.js';
import axios from 'axios';

export function RecipeInfoPage (){
    let { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/recipeGet?id=' + id.toString());
                setRecipe(response.data.recipe);
            } catch (error) {
                console.error(error);
            }
        }

       fetchRecipe();
    }, []); 

    return(
        <>
        {recipe ? (
        <div className='recipe-information-page'>
            <Navbar />
            <RecipeInfo recipe={recipe} />
            <RecipeIngredients ingredients={recipe.ingredients} ingredientAmounts={recipe.ingredientAmounts} />
            <RecipeInstructions instructions={recipe.instructions} />
            <RecipeTips tips={recipe.tips} />
        </div>) : (
        <div className='recipe-information-page'>
            <Navbar />
            <h1>Loading...</h1>
        </div>
        )}
        </>
    )
  }
