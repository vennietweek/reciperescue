import React from 'react';
import Navbar from '../containers/Navbar.js';
import Search from '../containers/Search.js';

export function HomePage(){
  return(
    <>
      <Navbar />
      <Search />
    </>
  );
}