import React from 'react';
import './CardList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export interface Product {
    productId: number;
    productName: string;
    image: string;
    price: number; 
}

interface CardListProps {
  products: Product[];
}

const CardList: React.FC<CardListProps> = ({ products }) => {
  return (
    <div className="card-list">
      {products.map(product => (
        <Card key={product.productId} className="product-card">
          <div className="card-img-container">
            <Card.Img variant="top" src={`data:image/jpeg;base64,${product.image}`} />
          </div>
          <Link to={`/product/${product.productId}`} className="product-link">
            <Card.Body>
              <Card.Title className="product-name">{product.productName}</Card.Title>
              <Card.Text className="price">${product.price.toFixed(2)}</Card.Text>
            </Card.Body>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default CardList;
