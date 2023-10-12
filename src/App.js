import './App.css';
import Navbar from './Navbar.js';
import Search from './Search.js';
import 'font-awesome/css/font-awesome.min.css';
import React, { useState } from 'react';
import CustomSearchBox from './CustomSearchBox';
import './CustomSearchBox.css'


function App() {
  const [items, setItems] = useState([]);
  const handleToggleItem = (index) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  return (
    <>
      <Navbar />
      <Search />
      <div className="shopping-list">
      <h1>Shopping List</h1>
      <CustomSearchBox />
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className={item.completed ? 'completed' : ''}
            onClick={() => handleToggleItem(index)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default App;
