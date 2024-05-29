import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import './ProductPage.css';
import { useAppSelector } from '../Store/Hooks';
import MyNavbar from '../Components/Navbar';

interface ProductVariant {
  productVariantId: string;
  size: string;
  stockQuantity: number;
}

interface Product {
  productId: number;
  productName: string;
  description: string;
  color: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const user = useAppSelector((state: any) => state.auth.user);

  useEffect(() => {
    axios.get(`https://localhost:7200/api/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const productVariant = product!.variants.find(v => v.size === selectedSize);
    if (!productVariant) {
      setMessage('Selected size is not available.');
      return;
    }
    if (quantity > productVariant.stockQuantity) {
      setMessage('Requested quantity is not available.');
      return;
    }
    
    try {
      const response = await axios.get(`https://localhost:7200/api/cart/checkItem`, {
        params: {
          userId: user.userId,
          productVariantId: productVariant.productVariantId
        }
      });
      const isExistingItem = response.data;

      if (isExistingItem) {
        await axios.put('https://localhost:7200/api/cart/updateCartItem', {
          userId: user.userId,
          productVariantId: productVariant.productVariantId,
          quantity
        });
      } else {
          await axios.post('https://localhost:7200/api/cart/toCart', {
          userId: user.userId,
          productVariantId: productVariant.productVariantId,
          size: selectedSize,
          quantity
        });
      }
      setMessage('Product added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setMessage('Error adding product to cart.');
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + delta;
      return newQuantity < 1 ? 1 : newQuantity;
    });
    setMessage('');
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(event.target.value);
    setMessage('');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const availableSizes = product.variants.map(variant => variant.size);

  return (
    <div>
      <MyNavbar />
      <Container className="product-page">
        <Row>
          <Col md={6}>
            {product.images.map((image, index) => {
              const imageUrl = `data:image/png;base64,${image}`;
              return <Image key={index} src={imageUrl} alt={product.productName} fluid className="product-image"/>;
            })}
          </Col>
          <Col md={6} className="details">
            <h1>{product.productName}</h1>
            <p>{product.description}</p>
            <h2>${product.price}</h2>
            <Form>
              <Form.Group controlId="sizeSelect">
                <Form.Label>Size</Form.Label>
                <Form.Control as="select" value={selectedSize} onChange={(e) => handleSizeChange(e as unknown as React.ChangeEvent<HTMLSelectElement>)}>
                  <option value="">Select a size</option>
                  {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <div className="quantity-control">
                <Button variant="outline-primary" onClick={() => handleQuantityChange(-1)}>-</Button>
                <span className="quantity">{quantity}</span>
                <Button variant="outline-primary" onClick={() => handleQuantityChange(1)}>+</Button>
              </div>
              <Button variant="primary" onClick={handleAddToCart} disabled={!selectedSize} className="add-to-cart-button">
                Add to Cart
              </Button>
            </Form>
            {message && <Alert variant={message.includes('added') ? 'success' : 'danger'} className="mt-3">{message}</Alert>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductPage;
