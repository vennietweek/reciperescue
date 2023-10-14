import React from 'react';
import { useState } from 'react';
import '../styles/recipeInfo.css';

export function RecipeIngredients(props) {
  const { ingredients, ingredientAmounts } = props;
    return (
      <>
      <div className="recipe-info-container">
        <div className="ingredients-container">
          <h4>Ingredients</h4>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={ingredient.id}>
                {ingredientAmounts[index]} {ingredient.name}
                  </li>
              ))}
          </ul>
        </div>
      </div>
      </>
    );
  }