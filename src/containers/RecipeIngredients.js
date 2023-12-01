import React, { useState, useEffect } from 'react';
import { Form, Button, ButtonGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/RecipeInfo.css';

export function RecipeIngredients(props) {
  const [ingredients] = useState(props.ingredients);
  const [initialServingSize] = useState(props.servingSize);
  const [servingSize, setServingSize] = useState(props.servingSize);
  const [unitSystem, setUnitSystem] = useState('imperial'); 
  const [baseImperialQuantities] = useState(props.ingredientAmounts);
  const [baseMetricQuantities, setBaseMetricQuantities] = useState([]);
  const [currentImperialQuantities, setCurrentImperialQuantities] = useState(props.ingredientAmounts);
  const [currentMetricQuantities, setCurrentMetricQuantities] = useState([]);
  const [displayedQuantities, setDisplayedQuantities] = useState(props.ingredientAmounts);
  const [checkedState, setCheckedState] = useState(new Array(ingredients.length).fill(false));
  const navigate = useNavigate();

  useEffect(() => {
    convertToMetric(props.ingredientAmounts);
  }, []);

  // Fetch and convert the initial quantities to metric in the background
  const convertToMetric = async (ingredientAmounts) => {
    const metricQuantities = await Promise.all(ingredientAmounts.map(async (amount, i) => {
      const response = await axios.get(`http://localhost:4000/api/convertWeight?ingredient=${ingredients[i].name}&amount=${amount}`);
      return response.data; 
    }));
    setBaseMetricQuantities(metricQuantities);
    setCurrentMetricQuantities(metricQuantities);
  };

  // Handle unit change between metric and imperial systems
  const handleUnitChange = (newUnitSystem) => {
    setUnitSystem(newUnitSystem);
    const updatedQuantities = newUnitSystem === 'imperial' ? currentImperialQuantities : currentMetricQuantities;
    setDisplayedQuantities(updatedQuantities);
  };

  // Handle serving size changes
  const updateServingSize = (newSize) => {
    if (newSize < 1) return; // Return if serving size is less than 1
    setServingSize(newSize);
    const scaleFactor = newSize / initialServingSize;
    const updatedImperial = baseImperialQuantities.map(qty => scaleQuantity(qty, scaleFactor));
    const updatedMetric = baseMetricQuantities.map(qty => scaleQuantity(qty, scaleFactor));
    setCurrentImperialQuantities(updatedImperial);
    setCurrentMetricQuantities(updatedMetric);
    setDisplayedQuantities(unitSystem === 'imperial' ? updatedImperial : updatedMetric);
  };

  // Helper function to scale ingredient quantities
  const scaleQuantity = (quantity, scaleFactor) => {
    const [amount, unit] = quantity.split(' ');
    const rawScaledAmount = Math.max(parseFloat(amount) * scaleFactor, 0.01);
    const scaledAmount = rawScaledAmount % 1 === 0 ? rawScaledAmount.toString() : rawScaledAmount.toFixed(1);
    return scaledAmount + ' ' + unit;
};
  
  // Handle checkbox changes
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

  // Function to handle adding ingredients to shopping list
  const handleAddToShoppingList = async () => {
    const validUnits = new Set([
      'lb', 'lbs', 'tsp', 'teaspoons', 'tbsp', 'tablespoons', 'cup', 'cups', 'oz', 
      'ounce', 'ounces', 'fl oz', 'pint', 'quart', 'gallon', 
    ]);

    const dbingredient = ingredients.filter((_, index) => checkedState[index]).map((ingredient) => ingredient.name);
    const quantity = currentImperialQuantities.filter((_, index) => checkedState[index]).map((qty) => {
    const unit = qty.split(' ')[1];
      return validUnits.has(unit) ? '1' : qty.split(' ')[0];
      });
    const input = { dbingredient, quantity };

    try {
      const response = await axios.post('http://localhost:4000/api/ingredients', input);
  
      // Reset the checks
      setCheckedState(new Array(ingredients.length).fill(false));
      navigate('/shopping_list');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
      <div className="recipe-detail-container">
        <div className="recipe-ingredients-container">
          <div className='recipe-ingredients-header'>
            <p><h4>Ingredients</h4></p>
            <div className="recipe-ingredient-converters">
              <FormControl className="ingredient-serving-size"
              type="number"
              value={servingSize}
              onChange={(e) => updateServingSize(Number(e.target.value))}
            />
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
                Metric (g)
              </Button>
            </ButtonGroup>
          </div>
        </div>
        {ingredients.map((ingredient, index) => (
          <p key={ingredient.id}>
            <Form.Check
              type="checkbox"
              id={`custom-checkbox-${index}`}
              label={`${displayedQuantities[index]} ${ingredient.name}`}
              checked={checkedState[index]}
              onChange={() => handleOnChange(index)}
              className="custom-checkbox"
            />
          </p>
          ))}
          <div className="ingredient-container-buttons">
            <Button variant="outline-primary" onClick={handleSelectAll} className='ingredient-select-all'>
              Select all
            </Button>
            <Button variant="outline-secondary" onClick={handleDeselectAll} className="ingredient-deselect-all">
              Deselect all
            </Button>
            <div className="spacer"></div>
            <Button type="button" className="ingredient-add-to-list" onClick={handleAddToShoppingList} disabled={!checkedState.some(checked => checked)}>
              Add to Shopping List
            </Button>
          </div>
        </div>
      </div>
  );
}
