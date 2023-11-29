import React, { useState, useEffect } from 'react';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/RecipeInfo.css';

export function RecipeIngredients(props) {
  const [ingredients] = useState(props.ingredients);
  const [ingredientAmounts, setIngredientAmounts] = useState(props.ingredientAmounts);
  const [unitSystem, setUnitSystem] = useState('imperial'); 
  const [metricQuantities, setMetricQuantities] = useState([...props.ingredientAmounts]);
  const [imperialQuantities] = useState([...props.ingredientAmounts]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndConvertIngredients = async () => {
      for (let i = 0; i < ingredients.length; i++) {
        const response = await axios.get(`http://localhost:4000/api/convertWeight?ingredient=${ingredients[i].name}&amount=${ingredientAmounts[i]}`);
        metricQuantities[i] = response.data
      }
      setMetricQuantities(metricQuantities);
    };
    fetchAndConvertIngredients();
  }, []); 
  
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

  const handleUnitChange = (newUnitSystem) => {
    setUnitSystem(newUnitSystem);
    if (newUnitSystem === 'metric') {
      setIngredientAmounts(metricQuantities);
    } else {
      setIngredientAmounts(imperialQuantities);
    }
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
      navigate('/shopping_list');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="ingredient-form">
      <div className="recipe-detail-container">
        <div className="recipe-ingredients-container">
          <div className='recipe-ingredients-header'>
          <p><h4>Ingredients</h4></p>
            <ButtonGroup className="ingredient-conversion">
              <Button variant="outline-*"
                className={unitSystem === 'imperial' ? 'ingredient-convert-button-active' : 'ingredient-convert-button-inactive'}
                onClick={() => handleUnitChange('imperial')}
              >
                Imperial
              </Button>
              <Button variant="outline-*"
                className={unitSystem === 'metric' ? 'ingredient-convert-button-active' : 'ingredient-convert-button-inactive'}
                onClick={() => handleUnitChange('metric')}
              >
                Metric
              </Button>
            </ButtonGroup>
            </div>
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
