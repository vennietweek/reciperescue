import React from 'react';
import { useState } from 'react';
import '../styles/recipeInfo.css';
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
    <div className="recipe-info-container">
      <h4>{recipe.title}</h4>
      <p>{recipe.description}</p>
      <span><FontAwesomeIcon icon={faClock} style={{color: "grey",fontSize:"20px"}} />&nbsp;&nbsp;{recipe.totalCookingTime} minutes </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span><FontAwesomeIcon icon={faFire} style={{color: "grey", fontSize:"20px"}} />&nbsp;&nbsp;{recipe.calories} calories </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span><FontAwesomeIcon icon={faConciergeBell} style={{color: "grey", fontSize:"20px"}} />&nbsp;&nbsp;Serves {recipe.servingSize} </span>
      <br/><br/>
      <Chip color="tertiary" disabled={false} size="medium" label={recipe.type} />
      {recipe.isVegetarian === true && (
        <>
          <Chip color="info" disabled={false} size="medium" label="Vegetarian" />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}
      {recipe.isVegan === true && (
        <>
          <Chip color="success" disabled={false} size="medium" label="Vegan" />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}
      {recipe.isDairyFree === true && (
        <>
          <Chip color="warning" disabled={false} size="medium" label="Dairy Free" />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}
      {recipe.isGlutenFree === true && (
        <>
          <Chip color="warning" disabled={false} size="medium" label="Gluten Free" />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}

    </div>
    </>
  )
}