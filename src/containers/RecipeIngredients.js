import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/RecipeInfo.css';

export function RecipeIngredients(props) {
  const { ingredients, ingredientAmounts } = props;

  // State to track checked ingredients
  const [checkedState, setCheckedState] = useState(
    new Array(ingredients.length).fill(false)
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  // Function to handle selecting all checkboxes
  const handleSelectAll = () => {
    setCheckedState(new Array(ingredients.length).fill(true));
  };

  // Function to handle deselecting all checkboxes
  const handleDeselectAll = () => {
    setCheckedState(new Array(ingredients.length).fill(false));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dbingredient = ingredients.filter((_, index) => checkedState[index]).map((ingredient) => ingredient.name);
    const quantity = ingredientAmounts.filter((_, index) => checkedState[index]);
    const input = { dbingredient, quantity };
    try {
      const response = await axios.post('http://localhost:4000/api/ingredients', input);

      // reset the the checks
      setCheckedState(new Array(ingredients.length).fill(false));

      console.log('Ingredients added successfully!');
      console.log('Ingredients in shopping list:', response.data);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="ingredient-form">
      <div className="recipe-detail-container">
        <div className="recipe-ingredients-container">
          <p><h4>Ingredients</h4></p>
          {ingredients.map((ingredient, index) => (
            <p><Form.Check
              type="checkbox"
              id={`custom-checkbox-${index}`}
              label={`${ingredientAmounts[index]} ${ingredient.name}`}
              key={ingredient.id}
              checked={checkedState[index]}
              custom
              onChange={() => handleOnChange(index)}
              className="custom-checkbox"
            /></p>
          ))}
          <div className="ingredient-container-buttons">
            <Button variant="outline-primary" onClick={handleSelectAll} className='ingredient-select-all'>
              Select all
            </Button>
            <Button variant="outline-secondary" onClick={handleDeselectAll} className="ingredient-deselect-all">
              Deselect all
            </Button>
            <div className="spacer"></div>
            <Button type="submit" variant="primary" className="ingredient-add-to-list">
              Add to Shopping List
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}
