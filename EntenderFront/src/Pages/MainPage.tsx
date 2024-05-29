import React, { useState, useEffect } from 'react';
import MyNavbar from '../Components/Navbar';
import CardList, { Product } from '../Components/CardList';
import '../styles.css';
import '../Components/CardList.css';

const MainPage: React.FC = () => {
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('https://localhost:7044/api/products/forCard')
      .then(response => response.json())
      .then(data => {
        setLoadedProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div>
      <MyNavbar />
      <div className="mainPage">
        <div className='container'>
          <div className="main-title">
            <h1>New Collection</h1>
          </div>
          <CardList products={loadedProducts} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
