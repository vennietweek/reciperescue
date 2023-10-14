import '../App.css';
import Navbar from '../Navbar.js';
import 'font-awesome/css/font-awesome.min.css';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { RecipeInfo } from '../containers/RecipeInfo.jsx';


export function RecipeInfoPage (){
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_RECIPE_BY_ID, {
        variables: { id }
      });
    const recipe = data.recipe;
    return(
        <>
        <Navbar />
        <RecipeInfo />
        </>
    )
  }
