import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MyNavbar from '../Components/Navbar';
import CardList, { Product } from '../Components/CardList';
import '../styles.css';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (query) {
      axios.get(`https://localhost:7044/api/products/search?query=${query}`)
        .then(response => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div>
      <MyNavbar />
      <div className="mainPage">
        <div className="container">
          <div className="main-title">
            {loading ? (
              <h1>Loading...</h1>
            ) : (
              <h1>
                {products.length === 0 ? (
                  `No results found for "${query}"`
                ) : (
                  `Results for "${query}"`
                )}
              </h1>
            )}
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            products.length > 0 && <CardList products={products} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
