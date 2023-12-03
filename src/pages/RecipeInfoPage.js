import React, { useState, useEffect } from 'react';
import Navbar from '../containers/Navbar.js';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { RecipeInfo } from '../containers/RecipeInfo';
import { RecipeIngredients } from '../containers/RecipeIngredients';
import { RecipeInstructions } from '../containers/RecipeInstructions';
import { RecipeNutrition } from '../containers/RecipeNutrition';
import { RecipeTips } from '../containers/RecipeTips';
import '../styles/RecipeInfo.css';

export function RecipeInfoPage() {
    let { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // New state variable for loading

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setIsLoading(true); // Start loading
                const response = await axios.get('http://localhost:4000/api/recipeGet?id=' + id);
                setRecipe(response.data);
            } catch (error) {
                console.error(error);
                setRecipe(null); // Set recipe to null if error
            } finally {
                setIsLoading(false); // Stop loading regardless of result
            }
        };
        fetchRecipe();
    }, [id]); // Depend on id to refetch if it changes

    // Loading state
    if (isLoading) {
        return (
            <div className='recipe-information-page d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <FontAwesomeIcon icon={faSpinner} spin size="2xl" style={{color: "#0D6EFD"}} />
            </div>
        );
    }

    // Recipe not found
    if (!recipe) {
        return (
            <>
            <Navbar />
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h1>Recipe not found</h1>
                <p>Oops! We can't find the recipe you're looking for.</p>
            </div>
            </>
        );
    }

    // Render recipe information
    return (
        <div className='recipe-information-page'>
            <Navbar />
            <RecipeInfo recipe={recipe} />
            <RecipeNutrition recipe={recipe} />
            <RecipeTips recipe={recipe} />
            <RecipeIngredients ingredients={recipe.ingredients} ingredientAmounts={recipe.ingredientAmounts} servingSize={recipe.servingSize} />
            <RecipeInstructions instructions={recipe.instructions} />
        </div>
    );
}
