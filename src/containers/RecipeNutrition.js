import React from 'react';
import { useState } from 'react';
import '../styles/RecipeInfo.css';

export function RecipeNutrition(props) {
    const { recipe } = props;
    return (
      <div className="recipe-detail-container">
      <div className="recipe-nutrition-container">
        <h4>Nutritional Information</h4>
        <div className="nutrition-facts">
          <div className="nutrition-item"><b>{recipe.calories}</b> <br/> Calories</div>
          <div className="nutrition-item"><b>{recipe.carbs}</b> <br/>Carbs</div>
          <div className="nutrition-item"><b>{recipe.fat}</b> <br/>Fat</div>
          <div className="nutrition-item"><b>{recipe.protein}</b><br/> Protein</div>
        </div>
        </div>
      </div>
    );
  }
  