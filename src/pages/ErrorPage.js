import React from 'react';
import Navbar from '../containers/Navbar.js';

export function ErrorPage(){
  return(
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <p>Oops! We can't find the page you're looking for.</p>
      </div>
    </>
  );
}