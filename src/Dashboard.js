import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; 
const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        console.log('Fetched data:', data);

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = () => {
    // Clear authentication token or any other user-related data from local storage
    localStorage.removeItem('token');
    // Navigate to the login route
    navigate('/');
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  // Calculate total amount in the cart
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Paginate products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className='card'>
      <div className='card-body'>
      {/* Search input */}
      <input
        className='search-box'
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    <button className="logout-button btn btn-primary" onClick={handleLogout}>Logout</button>
      {/* Cart info */}
      <div className="cart-info">
        <p>Cart Count: {cart.length}</p>
        <p>Total Amount: ${cartTotal.toFixed(2)}</p>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {currentProducts.map((product) => (
          <div className="col" key={product.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <h5 className="card-category">{product.category}</h5>
                <p className="card-text">{product.description}</p>
                <h4 className="discount-percentage">{product.discountPercentage}</h4>
                <button className='btn btn-primary' onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Dashboard;
