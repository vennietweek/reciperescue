import React, { useState, useEffect } from 'react';
import '../styles/DisplayRecipeList.css';
import axios from 'axios';

function DisplayRecipe(props) {
  const [displayTitle, setDisplayTitle] = useState('Popular Recipe');
  const [recipeList, setRecipeList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRandomList = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/randomRecipes');
            console.log(response.data.results);
            setRecipeList(response.data.results);
        } catch (error) {
            console.error(error);
        }
    }

    fetchRandomList();
  }, []); 

  useEffect(() => {
    if(props.searchList.length !== 0) {
        setIsLoading(true)
        setDisplayTitle('Search Results');
        // API call here
        axios.get(`http://localhost:4000/api/recipeSearch?ingredients=$`.concat(props.searchList.toString()))
          .then(response => {
            setRecipeList(response.data.results);
            setIsLoading(false);
          })
          .catch(error => {
            console.error(error);
          });
    }
  }, [props.searchList])

  if (isLoading) {
    return (
      <div className="recipe-display">
        <h3 className="display-title">Searching for recipes...</h3>
    </div>
    )
  }

  return (
    <>
    {recipeList ? (
    <div className="recipe-display">
        <h3 className="display-title">{displayTitle}</h3>
        <div className="recipe-container">
            {recipeList.map((recipe) => (
                <div className="recipe" key={recipe.id}>
                    <a href={recipe.link}><img className="img-thumbnail rounded mx-auto" src={recipe.image} alt={recipe.name} /></a>
                    <h2>{recipe.name}</h2>
                </div>
            ))}
        </div>
    </div>) : (
      <div className="recipe-display">
        <h3 className="display-title">Loading random popular recipes...</h3>
    </div>)}
    </>
  );
}

export default DisplayRecipe;