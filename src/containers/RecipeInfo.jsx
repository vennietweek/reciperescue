import React from 'react';
import { useState } from 'react';
import '../styles/recipeInfo.css';

export function RecipeInfo () {
    return (
        <>
        <div className="main">
            <div className="breadcrumbs">
                <span>Breadcrumb 1</span>
                <span>Breadcrumb 2</span>
                <span>Breadcrumb 3</span>
            </div>
            <img src="https://placekitten.com/400/300" alt="Kitten" />
            <Ingredients />
            <Instructions />
            <Nutrition />
        </div>
        </>
    )
}

function Ingredients() {
    return (
      <div className="ingredients-container">
        <h4>Ingredients</h4>
        <p>
          Carrots
        </p>
      </div>
    );
  }

  function Instructions() {
    return (
      <div className="instructions-container">
        <h4>Instructions</h4>
        <p>
          1. Heat oil and 1 tablespoon butter in a skillet over medium-high heat...
        </p>
      </div>
    );
  }

  function Nutrition() {
    return (
      <div className="recipe-nutrition-container">
        <h4>Nutritional Information</h4>
        <p>
          Calories
        </p>
      </div>
    );
  }

  function RecipeForm() {
      const [recipeName, setRecipeName] = useState('');
      const [recipeDescription, setRecipeDescription] = useState('');
      const [serves, setServes] = useState(0);
  
      return (
          <div className="recipe-container">
              <div className="input-group">
                  <label htmlFor="recipe-name">Recipe Name</label>
                  <input
                      type="text"
                      id="recipe-name"
                      value={recipeName}
                      onChange={e => setRecipeName(e.target.value)}
                  />
              </div>
  
              <div className="input-group">
                  <label>Recipe Description</label>
                  <input
                      type="text"
                      value={recipeDescription}
                      onChange={e => setRecipeDescription(e.target.value)}
                  />
              </div>
  
              {/* ... Other fields ... */}
  
              <div className="tag-group">
                  {/* You can make the tags stateful as well if required */}
                  <button className="tag">Vegan</button>
                  <button className="tag">Vegetarian</button>
                  <button className="tag">Dairy Free</button>
              </div>
  
              <div className="ingredients">
                  <h2>Ingredients</h2>
  
                  <div className="input-group">
                      <label htmlFor="serves">Serves</label>
                      <input
                          type="number"
                          id="serves"
                          value={serves}
                          onChange={e => setServes(e.target.value)}
                      />
                  </div>
  
                  {/* ... Other fields ... */}
  
                  <button className="primary-btn">Add to Shopping List</button>
              </div>
  
              <div className="instructions">
                  <h2>Instructions</h2>
                  <ol>
                      {/* You can map over a stateful array for the instructions */}
                      <li>Heat oil and 1 tablespoon butter in a skillet over medium-high heat.</li>
                      {/* ... Other steps ... */}
                  </ol>
              </div>
          </div>
      );
  }
  
  export default RecipeForm;
  