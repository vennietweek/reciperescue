import '../styles/App.css';
import React, { useState, useRef } from 'react';
import '../styles/Search.css';
import DisplayRecipe from '../containers/DisplayRecipeList.js';
import { Button, Form } from 'react-bootstrap';

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
      <div className="search">
        <h3 className="">What's in your fridge?</h3>
        <p>We're here to help keep your fridge free and tummy full. Tell us what ingredients you currently have in your fridge!</p>
        <div className="search-container">
            <div className="search-bar">
              <Form.Control className="ingredient-input-field" type="text" value={searchText} onChange={handleInputChange} onKeyDown={handleInputKeyPress} placeholder="Press Enter to add ingredients" ref={inputRef} />
              <Button className="search-button" onClick={search}>Search</Button>
            </div>
              <div className="ingredient-container" >
                  {ingredients.map((ingredient, index) => (
                      <div className="ingredient" key={index} readOnly><p>{ingredient}</p> <i className="fa fa-times fa-1x" onClick={() => deleteBubble(index)}></i></div>
                  ))}
                  {/* <i class="fa fa-search fa-1x search-icon"></i>    */}
              </div>
        </div>
        <DisplayRecipe searchList={searchList} display={displaySearch} />
      </div>
    </>
  );
}

export default Search;