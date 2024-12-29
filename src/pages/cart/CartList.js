import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";

const CartList = () => {
  const [cartList, setCartList] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartList = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8080/order/getCartList', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Ensure the response data is an array
        setCartList(response.data.myCartList);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        console.error('Error fetching cart list:', error);
        setCartList([]); // Set to an empty array on error
      }
    };

    fetchCartList();
  }, []);

  const calculateTotalPrice = (type, itemId) => {
    const updatedCartList = cartList.map((item) => {
      if (item.cartSeq === itemId) {
        const updatedQuantity =
          type === "increaseQuantity" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });
    setCartList(updatedCartList);
  };

  const increaseQuantity = (itemId) => {
    handleQuantityChangeLocal("increaseQuantity", itemId);
  };

  const decreaseQuantity = (itemId) => {
    handleQuantityChangeLocal("decreaseQuantity", itemId);
  };

  const removeCartItem = async (itemId) => {
    try {
      await axios.post(`http://localhost:8080/order/removeCartInfo`, {
        cartSeq: itemId
      }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
      });
      
      const updatedCartList = cartList.filter((item) => item.cartSeq !== itemId);
      setTotalPrice(totalPrice - cartList.find((item) => item.cartSeq === itemId).quantity * cartList.find((item) => item.cartSeq === itemId).productDTO.price);
      setCartList(updatedCartList);
      } catch (error) {
      console.error('Error removing cart item:', error);
      alert("삭제에 실패했습니다.");
    }
  };

  const updateCartQuantity = async (cartSeq, quantity) => {
    try {
      await axios.post('http://localhost:8080/order/updateCartQuantity', {
        cartSeq: cartSeq,
        quantity: quantity
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };

  const handleQuantityChangeLocal = (type, itemId) => {
    const updatedCartList = cartList.map((item) => {
      if (item.cartSeq === itemId) {
        const updatedQuantity =
          type === "increaseQuantity" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
          updateCartQuantity(item.cartSeq, updatedQuantity);
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });
    setCartList(updatedCartList);
  };

  const handleOrder = () => {
    navigate('/paymentInfo', { state: { cartList, totalPrice } });
  };

  return (
    <div>
      <Header type={null} />
      {/* Breadcrumb */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <a href="/"><i className="fa fa-home"></i> Home</a>
                <span>Shopping cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Cart Section */}
      <section className="shop-cart spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="shop__cart__table">
                <form id="myCart" method="post" action="/paymentInfo">
                  <table>
                    <thead>
                      <tr>
                        <th>상품</th>
                        <th>가격</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartList.map((item, index) => (
                        <tr key={item.cartSeq}>
                          <td className="cart__product__item">
                            <div style={{ width: "90px" }}>
                              <img
                                src={`http://localhost:8080/member/fileDownload?fileSeq=${item.productDTO.productFileList[0].file.fileSeq}`}
                                alt={item.productDTO.productName}
                              />
                            </div>
                            <div className="cart__product__item__title">
                              <h6>{item.productDTO.productName}</h6>
                              <span>{item.productStock.productSize}</span>
                              <div className="rating">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className="fa fa-star"></i>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="cart__price">
                            {new Intl.NumberFormat().format(item.productDTO.price)} 원
                          </td>
                          <td className="cart__quantity">
                            <div className="pro-qty">
                              <span
                                className="dec qtybtn"
                                onClick={() => decreaseQuantity(item.cartSeq)}
                              >
                                -
                              </span>
                              <input
                                type="text"
                                name={`cartList[${index}].quantity`}
                                id={`quantity${item.cartSeq}`}
                                value={item.quantity}
                                readOnly
                              />
                              <span
                                className="inc qtybtn"
                                onClick={() => increaseQuantity(item.cartSeq)}
                              >
                                +
                              </span>
                            </div>
                          </td>
                          <td className="cart__total">
                            ₩{new Intl.NumberFormat().format(item.productDTO.price * item.quantity)}
                          </td>
                          <td className="cart__close">
                            <span className="icon_close" onClick={() => removeCartItem(item.cartSeq)}></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="cart__btn">
                <a href="/main">Continue Shopping</a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6"></div>
            <div className="col-lg-4 offset-lg-2">
              <div className="cart__total__procced">
                <h6>Cart total</h6>
                <ul>
                  <li>
                    Total <span id="totalText">₩{new Intl.NumberFormat().format(totalPrice)}</span>
                  </li>
                </ul>
                <a href="#" className="primary-btn" onClick={handleOrder}>
                  주문하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartList;