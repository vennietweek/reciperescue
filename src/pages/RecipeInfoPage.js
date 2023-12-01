import '../styles/App.css';
import Navbar from '../containers/Navbar.js';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import '../styles/RecipeInfo.css';
import { useParams } from 'react-router-dom';
import { RecipeInfo } from '../containers/RecipeInfo';
import { RecipeIngredients } from '../containers/RecipeIngredients';
import { RecipeInstructions } from '../containers/RecipeInstructions';
import { RecipeNutrition } from '../containers/RecipeNutrition';
import { RecipeTips } from '../containers/RecipeTips'
import axios from 'axios';

const sampleRecipe = {
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
    isVegetarian: true,
    isVegan: true,
    isDairyFree: true,
    isGlutenFree: true,
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
  };

export function RecipeInfoPage (){
    let { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/recipeGet?id=' + id.toString());
                setRecipe(response.data);
            } catch (error) {
                console.error(error);
                setRecipe(sampleRecipe);
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
            <RecipeNutrition recipe={recipe} />
            <RecipeTips recipe={recipe} />
            <RecipeIngredients ingredients={recipe.ingredients} ingredientAmounts={recipe.ingredientAmounts} servingSize={recipe.servingSize}/>
            <RecipeInstructions instructions={recipe.instructions} />
        </div>) : (
        <div className='recipe-information-page d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
          <FontAwesomeIcon icon={faSpinner} spin size="2xl" style={{color: "#0D6EFD"}} />
        </div>
      )}
        </>
    )
  }
