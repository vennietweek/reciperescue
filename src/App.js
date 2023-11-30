import './styles/App.css';
import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage.js';
import { RecipeInfoPage } from './pages/RecipeInfoPage.js';
import { ShoppingListPage } from './pages/ShoppingListPage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/shopping_list" element={<ShoppingListPage/>} />
        <Route path ="/recipe/:id" element={<RecipeInfoPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
