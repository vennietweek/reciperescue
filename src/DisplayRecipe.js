import React, { useState, useEffect } from 'react';
import './DisplayRecipe.css';

const api_url = 'https://api.edamam.com/api/recipes/v2?type=public&app_id=3fd01beb&app_key=2dd8d7f3e5301d6d4f8bf91255504595%09&imageSize=REGULAR&field=label&field=image&field=totalTime&q='

const popularRecipes = [
    {
      name: 'Spaghetti Carbonara',
      imageURL: 'https://media.istockphoto.com/id/1144823591/photo/spaghetti-in-a-dish-on-a-white-background.jpg?s=612x612&w=0&k=20&c=SeEWmJfPQlX1zVUHPKjL-cgYeMs9cZ97-kdZMm7feA4=',
      timing: 30,
    },
    {
      name: 'Chicken Alfredo',
      imageURL: 'https://www.foodnetwork.com/content/dam/images/food/fullset/2015/9/15/1/FNK_Chicken-Fettucine-Alfredo_s4x3.jpg',
      timing: 45,
    },
    {
      name: 'Penne Arrabiata',
      imageURL: 'https://spoonacular.com/recipeImages/655573-556x370.jpg',
      timing: 45,
  },
  {
      name: 'Farfalle with Shrimps, Tomatoes Basil Sauce',
      imageURL: 'https://spoonacular.com/recipeImages/642594-556x370.jpg',
      timing: 45,
  },
    // Add more recipes here
  ];

function DisplayRecipe(props) {
  const [displayTitle, setDisplayTitle] = useState('Popular Recipe')
  const [recipeList, setRecipeList] = useState(popularRecipes);

  useEffect(() => {
    if(props.searchList.length !== 0) {
        setDisplayTitle('Search Results');
        // API call here
        var api_call = api_url.concat(props.searchList.join("%20"));
        console.log(api_call);
        fetch(api_call)
          .then(response => response.json())
          .then(data => {
            var rList = [];
            data['hits'].forEach((r) => {
              var recipe = {
                name: r['recipe']['label'],
                imageURL: r['recipe']['image'],
                timing: r['recipe']['totalTime'],
              };
              rList.push(recipe);
            })
            setRecipeList(rList);
          });
    }
  }, [props.searchList])

  return (
    <div class="recipe-display">
        <h3 class="display-title">{displayTitle}</h3>
        <div class="recipe-container">
            {recipeList.map((recipe, index) => (
                <div class="recipe" key={index} onClick=''>
                    <img class="img-thumbnail rounded mx-auto" src={recipe.imageURL} alt={recipe.name} />
                    <h2>{recipe.name}</h2>
                    <p>Timing: {recipe.timing} minutes</p>
                </div>
            ))}
        </div>
    </div>
  );
}

export default DisplayRecipe;