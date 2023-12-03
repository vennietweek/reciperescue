import React from 'react';
import { useState } from 'react';
import '../styles/RecipeInfo.css';

// Recipe Instructions Container
export function RecipeInstructions(props) {
    const { instructions } = props;
    return (
      <div className="recipe-detail-container">
        <div className="recipe-instructions-container">
        <h4>Instructions</h4>
        <ol className='recipe-instructions'>
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