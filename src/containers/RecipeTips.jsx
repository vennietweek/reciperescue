import React from 'react';
import { useState } from 'react';
import '../styles/recipeInfo.css';

export function RecipeTips(props) {
    const { tips } = props;
    return (
      <div className="recipe-info-container">
      <div className="recipe-tips-container">
        <h4>Recipe Tips</h4>
        <ol>
            {tips.map((tip, index) => (
              <li key={index}>
                {tips[index]} {tip}
                  </li>
              ))}
        </ol>
        </div>
      </div>
    );
  }
  