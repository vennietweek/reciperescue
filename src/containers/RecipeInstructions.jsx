import React from 'react';
import { useState } from 'react';
import '../styles/recipeInfo.css';

export function RecipeInstructions(props) {
    const { instructions } = props;
    return (
      <div className="recipe-info-container">
        <div className="instructions-container">
        <h4>Instructions</h4>
        <ol>
          {instructions.map((instruction, index) => (
            <li key={index}>
              {instruction}
            </li>
            ))}
        </ol>
        </div>
      </div>
    );
  }