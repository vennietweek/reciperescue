import React from 'react';
import { useState } from 'react';
import '../styles/RecipeInfo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons'
import { faFire } from '@fortawesome/free-solid-svg-icons'
import { faClock} from '@fortawesome/free-regular-svg-icons'
import Chip from '@mui/material-next/Chip'; 

export function RecipeInfo (props) {
  const { recipe } = props; 
  return (
    <>
    <div className='recipe-image-container'>
      <img src={recipe.image} className="recipe-image"/>
    </div>
    <div className="recipe-detail-container">
      <div className='recipe-info-container'>
      <h4>{recipe.title}</h4>
      <p>{recipe.description}</p>
      <span><FontAwesomeIcon icon={faClock} style={{color: "grey",fontSize:"20px"}} />&nbsp;&nbsp;{recipe.totalCookingTime} minutes </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span><FontAwesomeIcon icon={faFire} style={{color: "grey", fontSize:"20px"}} />&nbsp;&nbsp;{recipe.calories} calories </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span><FontAwesomeIcon icon={faConciergeBell} style={{color: "grey", fontSize:"20px"}} />&nbsp;&nbsp;Serves {recipe.servingSize} </span>
      <br/>
      <div className="tag-group">
      {recipe.isVegetarian === true && (
        <><Chip color="tertiary" disabled={false} size="medium" label="Vegetarian" /></>
      )}
      {recipe.isVegan === true && (
        <><Chip color="success" disabled={false} size="medium" label="Vegan" /></>
      )}
      {recipe.isDairyFree === true && (
        <><Chip color="warning" disabled={false} size="medium" label="Dairy Free" /></>
      )}
      {recipe.isGlutenFree === true && (
        <><Chip color="primary" disabled={false} size="medium" label="Gluten Free" /></>
      )}
    </div>
    </div>
    </div>
    </>
  )
}