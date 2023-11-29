import '../styles/App.css';
import React, { useState } from 'react';
import CustomSearchBox from '../containers/CustomSearchBox';
import Navbar from '../containers/Navbar.js';

export function ShoppingListPage(){
    const [items, setItems] = useState([]);
    const handleToggleItem = (index) => {
      const updatedItems = [...items];
      updatedItems[index].completed = !updatedItems[index].completed;
      setItems(updatedItems);
    };
  
    return(
      <>
        <Navbar />
        <div className="shopping-list">
          <h1>Shopping List</h1>
          <CustomSearchBox />
        </div>
      </>
    );
  }