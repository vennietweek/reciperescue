import React, { useState, useRef } from 'react';
import './Search.css';
import DisplayRecipe from './DisplayRecipe.js';

function Search() {
  const [searchText, setSearchText] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [displaySearch, setDisplaySearch] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && searchText.trim() !== '') {
      setIngredients([...ingredients, searchText.trim()]);
      setSearchText('');
    }
  };

  const deleteBubble = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
    inputRef.current.focus();
  };

  const search = () => {
    setSearchList(ingredients);
    setDisplaySearch(true);
  }

  return (
    <>
      <div class="search">
        <h3 class="">What's in your fridge?</h3>
        <p>We're here to help keep your fridge free and tummy full. Tell us what ingredients you currently have in your fridge!</p>
        <div class="search-container">
            <div class="search-bar">
                <div class="ingredient-container" >
                    {ingredients.map((ingredient, index) => (
                        <div class="ingredient" key={index} readonly><p>{ingredient}</p> <i class="fa fa-times fa-1x" onClick={() => deleteBubble(index)}></i></div>
                    ))}
                    <input type="text" value={searchText} onChange={handleInputChange} onKeyDown={handleInputKeyPress} placeholder="ingredients..." ref={inputRef} />
                    {/* <i class="fa fa-search fa-1x search-icon"></i>    */}
                </div>
            </div>
            <button class="search-button" onClick={search}>Search</button>
        </div>
        <DisplayRecipe searchList={searchList} display={displaySearch} />
      </div>
    </>
  );
}

export default Search;