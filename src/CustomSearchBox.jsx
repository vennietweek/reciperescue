import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';
import './CustomSearchBox.css'

function CustomSearchBox() {
  const [dbingredients, setDBIngredients] = useState([]);
  var openModalId = ''
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ingredients');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // Map the API response to the format used in your setListings state
        const mappedData = data.map((item) => ({
          ingredient: item.dbingredient,
          price: item.price === "" ? null : item.price,
          quantity: parseInt(item.quantity, 10) || 0, // Assuming quantity is a number
          imageLink: item.image,
          measurement: item.measurement ? "(" + item.measurement + ")" : "",
          imageUploaded: null, // Assuming you want to initialize this to null
          id: item._id,
        }));

        setListings(mappedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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

  const handleFormSubmit = async (e) => {  //allow user input details of the ingredients they want to add
    e.preventDefault();
    const price = e.target.price.value; //user input of ingredient price
    const quantity = Number(e.target.quantity.value); //user input of ingredient quantity
    // const imageUploaded = e.target.image.files[0]; //user input of ingredient image
    const imageUploaded = null; //user input of ingredient image
    const imageLink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png';
    const measurement = e.target.measurement.value;
    const id = uuidv4(); //generated id for user input of ingredient
    // if (!imageUploaded) { //handling error for no image uploaded
    //   alert('Please select an image.');
    //   return;
    // }
    // if (!price) { //handling error for no price uploaded
    //   alert('Please enter price.');
    //   return;
    // }
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
      measurement: "(" + measurement + ")",
      id,
    };

    const input = {
      dbingredient: selectedIngredient,
      quantity: quantity,
      measurement: measurement,
      price: price,
    };

    try {
      const response = await fetch('http://localhost:4000/api/add-ingredient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      // Handle the response data as needed
      // Map the API response to the format used in your setListings state
      const mappedData = data.map((item) => ({
        ingredient: item.dbingredient,
        price: item.price === "" ? null : item.price,
        quantity: parseInt(item.quantity, 10) || 0, // Assuming quantity is a number
        imageLink: item.image,
        measurement: item.measurement ? "(" + item.measurement + ")" : "",
        imageUploaded: null, // Assuming you want to initialize this to null
        id: item._id,
      }));

      setListings(mappedData);
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
    }


    // setListings([...listings, newListing]);
    setShowForm(false);
  };

  const toggleDropdown = () => { //there would always be a dropdown of suggestion when user clicks on add ingredients search bar
    setShowSuggestions(true);
  };

  const deleteIngredient = async (id) => { //handling delete ingredients by id
    try {
      // Make API request to delete ingredient by id
      await fetch(`http://localhost:4000/api/del-ingredients/${id}`, {
        method: 'DELETE',
        // Additional headers or authentication tokens if needed
      });

      // Update the state after successful deletion
      const newListings = listings.filter((listing) => listing.id !== id);
      setListings(newListings);
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      // Make API request to decrease quantity of ingredient by id
      const response = await fetch(`http://localhost:4000/api/decrease-quantity/${id}`, {
        method: 'PUT', // Use PUT for updating resources
        // Additional headers or authentication tokens if needed
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to decrease quantity: ${errorMessage}`);
      }

      // Assuming you have a state variable named 'listings' and a setter 'setListings'
      // Update the state after successful decrease in quantity
      setListings((ogListings) =>
        ogListings.map((listing) =>
          listing.id === id ? { ...listing, quantity: Math.max(1, listing.quantity - 1) } : listing
        )
      );
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const increaseQuantity = async (id) => {
    try {
      // Make API request to increase quantity of ingredient by id
      const response = await fetch(`http://localhost:4000/api/increase-quantity/${id}`, {
        method: 'PUT', // Use PUT for updating resources
        // Additional headers or authentication tokens if needed
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to increase quantity: ${errorMessage}`);
      }

      // Assuming you have a state variable named 'listings' and a setter 'setListings'
      // Update the state after successful increase in quantity
      setListings((ogListings) =>
        ogListings.map((listing) =>
          listing.id === id ? { ...listing, quantity: Math.min(999, listing.quantity + 1) } : listing
        )
      );
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const clearListings = async () => {
    try {
      // Make API request to clear all ingredients
      const response = await fetch('http://localhost:4000/api/clear-ingredients', {
        method: 'DELETE',
        // Additional headers or authentication tokens if needed
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to clear ingredients: ${errorMessage}`);
      }

      // Update the state after successful clearing
      setListings([]);
    } catch (error) {
      console.error('Error clearing ingredients:', error);
    }
  };
  const totalValue = listings.reduce((total, listing) => total + listing.price * listing.quantity, 0);
  const roundedTotalValue = totalValue.toFixed(2);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(null);

  const openModal = (items) => {
    setModalContent(items);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrice(null);
  };

  const handleSelectPrice = async (id, name, listingqty, price, image, original_name, measurement, qty) => {
    var new_qty = 1
    setModalContent(
      <div>
        <p>In your shopping list, you require:</p>
        <p>Ingredient: {original_name} {measurement}</p>
        <p>Quantity: {qty}</p>
        <br />
        <p>You are looking to purchase:</p>
        {listingqty ? (
          <p>Item: {name} {listingqty}</p>
        ) : (
          <p>Item: {name}</p>
        )}      {/* <p>Quantity: {new_qty}</p> */}
        <label htmlFor="newQty">Quantity:</label>
        <input
          type="number"
          id="newQty"
          name="newQty"
          defaultValue={new_qty}
          min="1"
          max="999"
        />
        <br />
        <button
          className="select-button"
          onClick={() => {
            const newQtyValue = parseInt(document.getElementById('newQty').value, 10);
            if (0 < newQtyValue && newQtyValue < 1000) {
              handleSave(id, name, price, image, listingqty, newQtyValue);
            } else {
              alert('Quantity should be between 1 and 999');
            }
          }}
        >
          Save
        </button>
      </div>
    )
  }

  const handleSave = async (id, name, price, image, listingqty, qty) => {
    closeModal();

    price = price.replace('$', '')
    var listingMeasurement = ''
    if (listingqty) {
      listingMeasurement = "(" + listingqty + ")"
    }
    setListings((ogListings) =>
      ogListings.map((listing) =>
        listing.id === id ? { ...listing, ingredient: name, price: price, imageLink: image, measurement: listingMeasurement, quantity: qty } : listing
      )
    );

    const response = await fetch(`http://localhost:4000/api/update-ingredient/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, listingqty, qty, image }),
    });

    // setSelectedPrice(price);
  };

  const checkPrice = async (listingId, listingIngredient, listingMeasurement, listingQuantity) => {
    const modalId = uuidv4(); // Generate a new UUID for each modal instance
    openModalId = modalId
    try {
      openModal('loading')
      const response = await fetch(`http://localhost:4000/api/getFairpriceItems?searchTerm=${encodeURIComponent(listingIngredient)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      if (data.length > 0) {
        const items = data.map(item => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.price}</td>
            <td>
              <button className="select-button" onClick={() => handleSelectPrice(listingId, `${item.name}`, `${item.quantity}`, `${item.price}`, `${item.image}`, listingIngredient, listingMeasurement, listingQuantity)}>
                Select
              </button>
            </td>
          </tr>
        ));
        if (openModalId === modalId) {
          setModalContent(
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          );
        }

      } else {
        if (openModalId === modalId) {
          setModalContent('No prices found for the specified ingredient.');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (openModalId === modalId) {
        setModalContent('An error occurred while fetching prices.');
      }
    }
  };

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
      </div>
      <div>
        {showForm && selectedIngredient && ( //accept user input of details of selected ingredient
          <div className="custom-form">
            <h3>{selectedIngredient}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="price">Price (Optional)</label>
                <input type="number" name="price" id="price" step="0.01"/>
              </div>

              <div className="form-group">
                <label htmlFor="measurement">Measurement</label>
                <input type="text" name="measurement" id="measurement" required />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input type="number" name="quantity" id="quantity" required />
              </div>

              {/* <div className="form-group">
                <label htmlFor="image">Image (Optional)</label>
                <input type="file" name="image" id="image" accept="image/*" />
              </div> */}

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
              <div className="name" style={{ textAlign: 'left' }}>{listing.ingredient} {listing.measurement}</div>
              <div style={{ textAlign: 'left' }}>
                {listing.price ? (
                  <div className="price" style={{ textAlign: 'left' }}>
                    ${listing.price}
                  </div>
                ) : (
                  // <button className="check-price-button" onClick={() => alert(listing.ingredient)}>Check Price</button>
                  <button className="check-price-button" onClick={() => checkPrice(listing.id, listing.ingredient, listing.measurement, listing.quantity)}>Check Price</button>
                )}
              </div>
            </div>
            <div className="column quantity-container">
              <button className="quantity-button" onClick={() => decreaseQuantity(listing.id)}><FaMinus /></button>
              <div className="quantity">{listing.quantity}</div>
              <button className="quantity-button" onClick={() => increaseQuantity(listing.id)}><FaPlus /></button>
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '70%', // Increase the width for the table
            margin: 'auto',
          },
        }}
      >
        <div>
          <button className="x-button" onClick={closeModal} style={{ float: 'right' }}>X</button>
          <h2>Price Information:</h2>
          {modalContent === 'loading' ? (
            <center><FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color: '#6f66f0' }} /></center>
          ) : (
            <div>{modalContent}</div>
          )}
        </div>
      </Modal>

      {selectedPrice && (
        <div>
          <p>Selected Price: {selectedPrice}</p>
          {/* Render other components or perform actions with the selected price */}
        </div>
      )}
    </div>
  );
}


export default CustomSearchBox;
