function Navbar() {
    return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="navbar">
      <div class="container-fluid">
        <a class="navbar-brand mx-2 my-auto" href="">Recipe Rescue</a>
        <div class="d-flex justify-content-start flex-nowrap"> 
          <ul class="navbar-nav mx-2 my-auto">
            <li class="nav-item mx-2"><a class="nav-link active" href="/">Home</a></li>
            <li class="nav-item mx-2"><a class="nav-link active" href="/shopping_list">Shopping List</a></li>             
          </ul>
        </div>
      </div>
    </nav>
    );
}

export default Navbar;