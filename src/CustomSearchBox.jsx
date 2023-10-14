import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './CustomSearchBox.css'

function CustomSearchBox() { 
  const [dbingredients, setDBIngredients] = useState([]);
  useEffect(() => { //setting up a "database" of ingredients
    setDBIngredients([
      {
        dbingredient: 'Apple',
        price: '1.99',
        quantity: '10',
        image: 'https://images.all-free-download.com/images/graphiclarge/camera_test_apple_560282.jpg', 
      },
      {
        dbingredient: 'Orange',
        price: '0.99',
        quantity: '15',
        image: 'https://images.all-free-download.com/images/graphiclarge/orange_backdrop_fruit_juice_petal_decor_6931338.jpg', 
      },
      {
        dbingredient: 'Banana',
        price: '0.49',
        quantity: '20',
        image: 'https://image.shutterstock.com/image-photo/stock-vector-whole-banana-with-half-slices-and-leaves-isolated-on-white-background-vector-illustration-450w-286161728.jpg', 
      },
    ]);
  }, []);
  useEffect(() => { //setting up "database" of ingredients added from recipe page
    setListings([
      {
        ingredient: 'Apple',
        price: '1.99',
        quantity: 10,
        imageLink: 'https://images.all-free-download.com/images/graphiclarge/camera_test_apple_560282.jpg',
        imageUploaded: null,
        id: 'test123',
      },
      {
        ingredient: 'Orange',
        price: '0.99',
        quantity: 15,
        imageLink: 'https://images.all-free-download.com/images/graphiclarge/orange_backdrop_fruit_juice_petal_decor_6931338.jpg',
        imageUploaded: null,
        id: 'test234',
      },
      {
        ingredient: 'Banana',
        price: '0.49',
        quantity: 20,
        imageLink: 'https://image.shutterstock.com/image-photo/stock-vector-whole-banana-with-half-slices-and-leaves-isolated-on-white-background-vector-illustration-450w-286161728.jpg',
        imageUploaded: null,
        id: 'test345',
      },
    ]);
  }, []);
  const [userInput, setUserInput] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropDownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { 
    const handleClickOutside = (event) => { //handling clicks outside of add ingredients search bar
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => { //'add ingredients search bar'
    const query = e.target.value;
    setUserInput(query);
    const filtered = dbingredients.filter(item => item['dbingredient'].toLowerCase().includes(query.toLowerCase()));
    const filteredIngredients = filtered.map(item => item['dbingredient']);
    setFilteredIngredients([query, ...filteredIngredients.slice(0, 5)]); //dropdown suggestion for 'add ingredients search bar' to suggest ingredients in "database"
  };

  const handleItemClick = (ingredient) => { //handling selected ingredient
    setSelectedIngredient(ingredient);
    setShowForm(true);
    setShowSuggestions(false); //turn off suggestions after user selected ingredient
  };

  const handleFormSubmit = (e) => {  //allow user input details of the ingredients they want to add
    e.preventDefault();
    const price = e.target.price.value; //user input of ingredient price
    const quantity = Number(e.target.quantity.value); //user input of ingredient quantity
    const imageUploaded = e.target.image.files[0]; //user input of ingredient image
    const imageLink = null; 
    const id = uuidv4(); //generated id for user input of ingredient
    if (!imageUploaded) { //handling error for no image uploaded
      alert('Please select an image.');
      return;
    } 
    if (!price) { //handling error for no price uploaded
      alert('Please enter price.');
      return;
    }
    if (!quantity) { //handling error for no quantity uploaded
      alert('Please enter quantity.');
      return;
    }

    const newListing = {  //creation of a new listing
      ingredient: selectedIngredient,
      price,
      quantity,
      imageUploaded,
      imageLink,
      id,
    };

    setListings([...listings, newListing]);
    setShowForm(false);
  };

  const toggleDropdown = () => { //there would always be a dropdown of suggestion when user clicks on add ingredients search bar
    setShowSuggestions(true);
  };

  const deleteIngredient = (id) => { //handling delete ingredients by id
    const newListings = listings.filter((listing) => listing.id !== id);
    setListings(newListings);
  };

  const decreaseQuantity = (id) => { //enable user to decrease quantity of added ingredient 
    setListings((ogListings) =>
      ogListings.map((listing) => {
        if (listing.id === id) {
          return { ...listing, quantity: Math.max(1, listing.quantity - 1) };
        }
        return listing;
      })
    );
  };

  const increaseQuantity = (id) => { //enable user to increase quantity of added ingredient
    setListings((ogListings) =>
      ogListings.map((listing) => {
        if (listing.id === id) {
          return { ...listing, quantity: Math.min(999, listing.quantity + 1) };
        }
        return listing;
      })
    );
  };

  const clearListings = () => { //enable user clear all ingredients in shopping list
    setListings([]);
  };

  const totalValue = listings.reduce((total, listing) => total + listing.price * listing.quantity, 0);
  const roundedTotalValue = totalValue.toFixed(2);


  return (
    <div>
    <div id="shopping_list" className="custom-search-box">
      <div id="add-ingredient-container">
      <input //input for add ingredients search bar
        type="text"
        placeholder="Add ingredients..."
        value={userInput}
        onChange={handleSearch}
        onClick={toggleDropdown}
        ref={inputRef}
      />
      {showSuggestions && userInput && ( //show suggestions of existing ingredients in database as well as user input in the dropdown
        <ul className="custom-dropdown" ref={dropDownRef}>
          {filteredIngredients.map((ingredient, index) => (
            <li key={index} onClick={() => handleItemClick(ingredient)}>
              {ingredient}
            </li>
          ))}
        </ul>
      )}
      </div>
      {showForm && selectedIngredient && ( //accept user input of details of selected ingredient
        <div className="custom-form">
          <h3>{selectedIngredient}</h3>
          <form onSubmit={handleFormSubmit}>
            <input type="number" name="price" placeholder="Price" />
            <input type="number" name="quantity" placeholder="Quantity" />
            <input type="file" name="image" accept="image/*" />
            <button className="submit-button" type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
    <div className="grocery-list">
    <button className="clear-button" onClick={clearListings}>
      Clear List
    </button>
    {listings.map((listing, index) => (
      <div key={index} className="list-listing">
        <div className="column image-container">
        {listing.imageUploaded === null ? (
            <img src={listing.imageLink} alt={listing.ingredient} />
            ) : (
              <img src={URL.createObjectURL(listing.imageUploaded)} alt={listing.ingredient} />
              )}
        </div>
        <div className="column listing-details">
          <div className="name" style={{ textAlign: 'left' }}>{listing.ingredient}</div>
          <div className="price" style={{ textAlign: 'left' }}>${listing.price}</div>
        </div>
        <div className="column quantity-container">
          <button className="quantity-button" onClick={() => decreaseQuantity(listing.id)}><FaMinus/></button>
          <div className="quantity">{listing.quantity}</div>
          <button className="quantity-button" onClick={() => increaseQuantity(listing.id)}><FaPlus/></button>
        </div>
        <div className="column trash-container">
          <button className="trash-button" onClick={() => deleteIngredient(listing.id)}>
            <FaTrash />
          </button>
        </div>
      </div>
    ))}
    <p>Total Price: ${roundedTotalValue}</p>
  </div>
</div>
  );
}

export default CustomSearchBox;
