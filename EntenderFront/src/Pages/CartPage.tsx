import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import './CartPage.css';
import { useAppSelector } from '../Store/Hooks';
import MyNavbar from '../Components/Navbar';
import { Link } from 'react-router-dom';

interface CartItem {
  cartItemId: string;
  productVariantId: string;
  productId: string;
  productName: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const userId = useAppSelector(state => state.auth.user?.userId);

  useEffect(() => {
    if (userId) {
      axios.get(`https://localhost:7044/api/cart/${userId}`)
        .then(response => {
          setCartItems(response.data);
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, [userId]);

  const handleRemoveFromCart = (cartItemId: string) => {
    axios.delete(`https://localhost:7044/api/cart/${cartItemId}`)
      .then(response => {
        setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handleQuantityChange = (cartItemId: string, change: number) => {
    const item = cartItems.find(item => item.cartItemId === cartItemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity < 1) return;
  
      axios.get(`https://localhost:7044/api/cart/productVariant/${item.productVariantId}`)
      .then(response => {
        const availableStock = response.data.stockQuantity;

        if (newQuantity > availableStock) {
          alert('Not enough stock available');
          return;
        }

        axios.put(`https://localhost:7044/api/cart/${item.cartItemId}`, {
          userId: userId,
          productVariantId: item.productVariantId,
          quantity: newQuantity
        })
          .then(response => {
            setCartItems(cartItems.map(item => {
              if (item.cartItemId === cartItemId) {
                return { ...item, quantity: newQuantity };
              }
              return item;
            }));
          })
          .catch(error => {
            console.error('Error updating cart item:', error);
            alert('Error updating cart item: ' + error.message);
          });
      })
      .catch(error => {
        console.error('Error fetching stock quantity:', error);
        alert('Error fetching stock quantity: ' + error.message);
      });
  }
};
  

  return (
    <div>
      <MyNavbar />
      <Container className="cart-page">
        <div className="main-title">
          <h1>Your Cart</h1>
        </div>
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <h2>Your cart is currently empty.</h2>
            <p>Don't be shy! Add something here!</p>
            <Link to="/">
              <Button variant="primary">Go Shopping</Button>
            </Link>
          </div>
        ) : (
        <Row className="card-list">
          {cartItems.map(item => (
            <Card key={item.cartItemId} className="product-card">
              <div className="card-img-container">
                <Card.Img variant="top" src={`data:image/jpeg;base64,${item.image}`} />
              </div>
              <Card.Body>
                <Link to={`/product/${item.productId}`} className="product-link">
                  <Card.Title className="product-name">{item.productName}</Card.Title>
                </Link>
                <Card.Text>Size: {item.size}</Card.Text>
                <Card.Text className="price">${item.price.toFixed(2)}</Card.Text>
                <div className="quantity-remove-container">
                  <div className="quantity-control">
                    <Button variant="outline-primary" onClick={() => handleQuantityChange(item.cartItemId, -1)} disabled={item.quantity <= 1}>-</Button>
                    <span className="quantity">{item.quantity}</span>
                    <Button variant="outline-primary" onClick={() => handleQuantityChange(item.cartItemId, 1)}>+</Button>
                  </div>
                  <Button variant="danger" onClick={() => handleRemoveFromCart(item.cartItemId)}>Remove</Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Row>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
