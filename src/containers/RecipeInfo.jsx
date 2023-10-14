import React from 'react';
import { useState } from 'react';
import '../styles/recipeInfo.css';

export function RecipeInfo (props) {
  const { recipe } = props; 
  return (
    <>
    <div className='recipe-image-container'>
      <img src={recipe.image} className="recipe-image"/>
    </div>
    <div className="recipe-info-container">
      <h4>{recipe.title}</h4>
      <p>{recipe.description}</p>
    </div>
    </>
  )
}