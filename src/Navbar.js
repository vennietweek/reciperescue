function Navbar() {
    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="navbar">
      <div className="container-fluid">
        <a className="navbar-brand mx-2 my-auto" href="">Recipe Rescue</a>
        <div className="d-flex justify-content-start flex-nowrap"> 
          <ul className="navbar-nav mx-2 my-auto">
            <li className="nav-item mx-2"><a className="nav-link active" href="/">Home</a></li>
            <li className="nav-item mx-2"><a className="nav-link active" href="/shopping_list">Shopping List</a></li>             
          </ul>
        </div>
      </div>
    </nav>
    );
}

export default Navbar;