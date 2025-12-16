// Cart.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

// نموذج بيانات المنتجات في السلة
const sampleCartData = [
  { id: 1, name: 'منتج 1', price: 100, quantity: 2, image: 'product1.jpg' },
  { id: 2, name: 'منتج 2', price: 200, quantity: 1, image: 'product2.jpg' },
  { id: 3, name: 'منتج 3', price: 150, quantity: 1, image: 'product3.jpg' }
];

const Cart = () => {
  const [cart, setCart] = useState(sampleCartData);

  // تحديث الكمية
  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  // حذف المنتج من السلة
  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  // حساب المجموع الكلي
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Container>
      <h2>سلة المشتريات</h2>
      <Row>
        {cart.map(item => (
          <Col md={4} key={item.id} className="mb-4">
            <div className="border p-3">
              <img src={item.image} alt={item.name} style={{ width: '100%' }} />
              <h4>{item.name}</h4>
              <p>السعر: {item.price} ل.س</p>
              
              {/* تعديل الكمية */}
              <Form.Control 
                type="number" 
                value={item.quantity} 
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} 
                min="1" 
              />
              
              {/* زر الحذف */}
              <Button 
                variant="danger" 
                className="mt-2" 
                onClick={() => removeItem(item.id)}
              >
                حذف
              </Button>
            </div>
          </Col>
        ))}
      </Row>
      {/* المجموع الكلي */}
      <div className="mt-4">
        <h4>المجموع الكلي: {getTotalPrice()} ل.س</h4>
        <Button variant="primary" className="mt-2">إتمام الطلب</Button>
      </div>
    </Container>
  );
};

export default Cart;
;