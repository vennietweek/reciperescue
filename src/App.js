import './styles/App.css';
import Navbar from './containers/Navbar.js';
import Search from './pages/Search.js';
import 'font-awesome/css/font-awesome.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RecipeInfoPage } from './pages/RecipeInfoPage.js';
import { ShoppingListPage } from './pages/ShoppingListPage.js';

function Home(){
  return(
    <>
      <Navbar />
      <Search />
    </>
  );
}

function ShoppingList(){
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/shopping_list" element={<ShoppingListPage/>} />
        <Route path ="/recipe/:id" element={<RecipeInfoPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
