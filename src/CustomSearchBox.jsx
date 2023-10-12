import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

function CustomSearchBox() {
  const [dbingredients, setDBIngredients] = useState([]);
  useEffect(() => {
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
  useEffect(() => {
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
    const handleClickOutside = (event) => {
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

  const handleSearch = (e) => {
    const query = e.target.value;
    setUserInput(query);
    const filtered = dbingredients.filter(item => item['dbingredient'].toLowerCase().includes(query.toLowerCase()));
    const filteredIngredients = filtered.map(item => item['dbingredient']);
    setFilteredIngredients([query, ...filteredIngredients.slice(0, 5)]);
  };

  const handleItemClick = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowForm(true);
    setShowSuggestions(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const price = e.target.price.value;
    const quantity = Number(e.target.quantity.value);
    const imageUploaded = e.target.image.files[0];
    const imageLink = null;
    const id = uuidv4();
    if (!imageUploaded) {
      alert('Please select an image.');
      return;
    } 
    if (!price) {
      alert('Please enter price.');
      return;
    }
    if (!quantity) {
      alert('Please enter quantity.');
      return;
    }

    const newListing = { 
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

  const toggleDropdown = () => {
    setShowSuggestions(true);
  };

  const deleteIngredient = (id) => {
    const newListings = listings.filter((listing) => listing.id !== id);
    setListings(newListings);
  };

  const decreaseQuantity = (id) => {
    setListings((ogListings) =>
      ogListings.map((listing) => {
        if (listing.id === id) {
          return { ...listing, quantity: Math.max(1, listing.quantity - 1) };
        }
        return listing;
      })
    );
  };

  const increaseQuantity = (id) => {
    setListings((ogListings) =>
      ogListings.map((listing) => {
        if (listing.id === id) {
          return { ...listing, quantity: Math.min(999, listing.quantity + 1) };
        }
        return listing;
      })
    );
  };

  const clearListings = () => {
    setListings([]);
  };

  return (
    <div>
    <div className="custom-search-box">
      <input
        type="text"
        placeholder="Add ingredients..."
        value={userInput}
        onChange={handleSearch}
        onClick={toggleDropdown}
        ref={inputRef}
      />
      {showSuggestions && userInput && (
        <ul className="custom-dropdown" ref={dropDownRef}>
          {filteredIngredients.map((ingredient, index) => (
            <li key={index} onClick={() => handleItemClick(ingredient)}>
              {ingredient}
            </li>
          ))}
        </ul>
      )}
      {showForm && selectedIngredient && (
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
  </div>
</div>
  );
}

export default CustomSearchBox;
