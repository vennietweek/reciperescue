import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';
import '../styles/CustomSearchBox.css'
import { Carousel, Card, Button } from 'react-bootstrap';

var openModalId = ''

function CustomSearchBox() {
  const [dbingredients, setDBIngredients] = useState([]);
  
  useEffect(() => { //setting up a "database" of ingredients
    setDBIngredients([
      {
        dbingredient: 'Apple',
        image: 'https://images.all-free-download.com/images/graphiclarge/camera_test_apple_560282.jpg',
      },
      {
        dbingredient: 'Orange',
        image: 'https://images.all-free-download.com/images/graphiclarge/orange_backdrop_fruit_juice_petal_decor_6931338.jpg',
      },
      {
        dbingredient: 'Banana',
        image: 'https://image.shutterstock.com/image-photo/stock-vector-whole-banana-with-half-slices-and-leaves-isolated-on-white-background-vector-illustration-450w-286161728.jpg',
      },
      {
        dbingredient: 'Mango',
        image: 'https://www.stockvault.net//data/2011/03/20/119586/thumb16.jpg',
      },
      {
        dbingredient: 'Pear',
        image: 'https://thumbs.dreamstime.com/b/red-yellow-pear-fruit-leaf-isolated-white-clipping-path-78863322.jpg',
      },
    ]);
  }, []);
  useEffect(() => { //get the ingredients from mongoDB to display
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ingredients');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        //map the api response to the format used in listings state
        const mappedData = data.map((item) => ({
          ingredient: item.dbingredient,
          price: item.price === "" ? null : item.price,
          quantity: parseInt(item.quantity, 10) || 0, 
          image: item.image,
          measurement: item.measurement ? "(" + item.measurement + ")" : "",
          id: item._id,
        }));

        setListings(mappedData); //set mappedData (ingredients that were saved in mongoDB) using setListings 
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
    const q = {'dbingredient': query, 'image': ''}
    setFilteredIngredients([q, ...filtered.slice(0, 5)]); //dropdown suggestion for 'add ingredients search bar' to suggest ingredients in "database"
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
    const image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/1200px-Icon-round-Question_mark.svg.png';
    const measurement = e.target.measurement.value;
    const id = uuidv4(); //generated id for user input of ingredient

    if (!quantity) { //handling error for no quantity uploaded
      alert('Please enter quantity.');
      return;
    }

    const input = {
      dbingredient: selectedIngredient.dbingredient,
      quantity: quantity,
      measurement: measurement,
      price: price,
      image: selectedIngredient.image,
    };

    try {
      const response = await fetch('http://localhost:4000/api/add-ingredient', { //post new manually added ingredient to mongoDB
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
      //map the api response to the format used in your listings state to update listings such that front end is updated
      const mappedData = data.map((item) => ({ 
        ingredient: item.dbingredient,
        price: item.price === "" ? null : item.price,
        quantity: parseInt(item.quantity, 10) || 0, 
        image: item.image,
        measurement: item.measurement ? "(" + item.measurement + ")" : "",
        id: item._id,
      }));

      setListings(mappedData); //handle errors
    } catch (error) {
      console.error('Error:', error);
    }


    setShowForm(false);
  };

  const toggleDropdown = () => { //there would always be a dropdown of suggestion when user clicks on add ingredients search bar
    setShowSuggestions(true);
  };

  const deleteIngredient = async (id) => { //handling delete ingredients by id
    try {
      //make api request to delete ingredient by id
      await fetch(`http://localhost:4000/api/del-ingredients/${id}`, {
        method: 'DELETE',
      });

      //update the listings state after successful deletion
      const newListings = listings.filter((listing) => listing.id !== id);
      setListings(newListings);
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      //make api request to decrease quantity of ingredient by id
      const response = await fetch(`http://localhost:4000/api/decrease-quantity/${id}`, {
        method: 'PUT', //use PUT for updating resources
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to decrease quantity: ${errorMessage}`);
      }

      //update the listings state after successful decrease in quantity
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
      //make api request to increase quantity of ingredient by id
      const response = await fetch(`http://localhost:4000/api/increase-quantity/${id}`, {
        method: 'PUT', // use PUT for updating resources
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to increase quantity: ${errorMessage}`);
      }

      //update the listings state after successful increase in quantity
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
      //make api request to clear all ingredients
      const response = await fetch('http://localhost:4000/api/clear-ingredients', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to clear ingredients: ${errorMessage}`);
      }

      //update the state after successful clearing
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

  //open modal for user to select item when user clicks on 'check price'
  const openModal = (items) => {
    setModalContent(items);
    setIsModalOpen(true);
  };

  //close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrice(null);
  };

  //modal display for user to adjust quantities after selecting Fairprice ingredient using 'check price'
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

  //update listings and save front end copy
  const handleSave = async (id, name, price, image, listingqty, qty) => {
    closeModal();

    price = price.replace('$', '')
    var listingMeasurement = ''
    if (listingqty) {
      listingMeasurement = "(" + listingqty + ")"
    }
    setListings((ogListings) =>
      ogListings.map((listing) =>
        listing.id === id ? { ...listing, ingredient: name, price: price, image: image, measurement: listingMeasurement, quantity: qty } : listing
      )
    );

    //update mongoDB
    const response = await fetch(`http://localhost:4000/api/update-ingredient/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, listingqty, qty, image }),
    });

  };

  //display modal when 'check price' button is clicked
  const checkPrice = async (listingId, listingIngredient, listingMeasurement, listingQuantity) => {
    const modalId = uuidv4(); //generate a new UUID for each modal instance
    openModalId = modalId
    try {
      openModal('loading')
      const response = await fetch(`http://localhost:4000/api/getFairpriceItems?searchTerm=${encodeURIComponent(listingIngredient)}`);
      const data = await response.json();
      if (data.length > 0) {
        const groupedItems = [];
            for (let i = 0; i < data.length; i += 4) {
                groupedItems.push(data.slice(i, i + 4));
            }
        const carouselItems = groupedItems.map((group, index) => (
          <Carousel.Item className='carousel-item' key={index}>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {group.map((item, idx) => (
                      <Card className="carousel-card" key={idx} style={{ width: '18rem', marginRight: '15px' }} >
                          <Card.Img variant="top" src={item.image} style = {{ height: '15rem', width: '15rem'}}/>
                          <Card.Body style={{ backgroundColor: '#f8f8f8' }}>
                              <Card.Title className="card-title">{item.name}</Card.Title>
                              <Card.Text style={{ fontSize: '14px'}}>
                                  Price: {item.price}<br />
                                  Quantity: {item.quantity}
                              </Card.Text>
                              <Button className="select-button" onClick={() => {
                                  handleSave(listingId, item.name, item.price, item.image, item.quantity, listingQuantity); 
                              }}>
                                  Select
                              </Button>
                          </Card.Body>
                      </Card>
                  ))}
              </div>
          </Carousel.Item>
        ));
                
        if (openModalId === modalId) {
          setModalContent(
            <>
            <Carousel className='carousel' interval={null} indicators={false}>
            {carouselItems}
            </Carousel>
            </>
          );
        }

      } else {
        if (openModalId === modalId) {
          setModalContent('No prices found for the specified ingredient.'); //ingredient cannot be found by scraping Fairprice web
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (openModalId === modalId) {
        setModalContent('An error occurred while fetching prices.'); //handle error
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
                  {ingredient.dbingredient}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        {showForm && selectedIngredient && ( //accept user input of details of selected ingredient
          <div className="custom-form">
            <h3>{selectedIngredient.dbingredient}</h3>
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
              <img src={listing.image} alt={listing.ingredient} />
            </div>
            <div className="column listing-details">
              <div className="name" style={{ textAlign: 'left' }}>{listing.ingredient} {listing.measurement}</div>
              <div style={{ textAlign: 'left' }}>
                {listing.price ? (
                  <div className="price" style={{ textAlign: 'left' }}>
                    ${listing.price}
                  </div>
                ) : (
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
            width: '70%', 
            height: '60%',
            margin: 'auto',
          },
        }}
      >
        <div>
          <button className="x-button" onClick={closeModal} style={{ float: 'right' }}>X</button>
          <h2>Price Information</h2>
          {modalContent === 'loading' ? (
            <div className='custom-search-box-page d-flex justify-content-center align-items-center' style={{ height: '80vh' }}>
            <center><FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: '#0D6EFD' }} /></center>
            </div>
          ) : (
            <div>{modalContent}</div>
          )}
        </div>
      </Modal>

      {selectedPrice && (
        <div>
          <p>Selected Price: {selectedPrice}</p>
        </div>
      )}
    </div>
  );
}


export default CustomSearchBox;
