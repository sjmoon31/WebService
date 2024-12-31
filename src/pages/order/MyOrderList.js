import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from '../../components/Header';
import Side from '../../components/Side';
import './myOrder.css';

// OrderList Component
const MyOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderList(currentPage);
  }, [currentPage]);

  const fetchOrderList = (page) => {
    setLoading(true);

    const token = localStorage.getItem('jwtToken');
    axios.get(`http://localhost:8080/order/getMyOrderList`, {
        params: {
            page: page
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setOrders(response.data.myOrderList.content);
        setTotalPages(response.data.myOrderList.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if(err.response && err.response.status === 401) {
          alert('로그인이 필요합니다.');
          localStorage.removeItem('userName');
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } else {  
          setError('주문 내역을 불러오는 중 오류가 발생했습니다.');
        }
      });
  };

  const formatPrice = (price) => {
    return price.toLocaleString() + "원";
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleRefund = async (paymentSeq) => {
    if (window.confirm('결제를 취소하시겠습니까?')) {
      try {
        await axios.post('http://localhost:8080/order/refund', { paymentSeq }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
        });
        alert('결제가 취소되었습니다.');
        fetchOrderList(currentPage); // Refresh the order list
      } catch (error) {
        console.error('Error processing refund:', error);
        alert('결제 취소에 실패했습니다.');
      }
    }
  };

  const handleReview = (orderInfoSeq, productSeq, sizeType) => {
    navigate(`/myReviewInfo/${orderInfoSeq}/${productSeq}/${sizeType}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Header type={null} />
      <Side type={null} />
      {/* Breadcrumb */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <a href="./index.html">
                  <i className="fa fa-home"></i> Home
                </a>
                <span>주문 내역 관리</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order List Table */}
      <section className="order-manage spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <div className="order-manage-table">
                  <table>
                    <thead>
                      <tr>
                        <th>상품</th>
                        <th>주문일자</th>
                        <th>수량</th>
                        <th>가격</th>
                        <th colSpan="2">주문상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order, index) => (
                          <tr key={index}>
                            <td className="order-manage-item">
                              <div style={{ width: "90px" }}>
                                <img
                                  src={`http://localhost:8080/member/fileDownload?fileSeq=${order.productDTO.productFileList[0].file.fileSeq}`}
                                  alt=""
                                />
                              </div>
                              <div className="order-manage-item-title">
                                <h6>{order.productDTO.productName}</h6>
                                <span>{order.productStock.productSize}</span>
                                <div className="rating">
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                  <i className="fa fa-star"></i>
                                </div>
                              </div>
                            </td>
                            <td className="order-date">{formatDate(order.orderDate)}</td>
                            <td className="order-quantity">{order.quantity}</td>
                            <td className="order-price">
                              {formatPrice(order.productDTO.price)}
                            </td>
                            <td className="order-state-td">
                              <p>
                                <span className="order-state">
                                {order.orderStsType === "ORDER_COMPLETE" && (
                                  <span style={{ marginLeft: "25px" }}>주문완료</span>
                                )}
                                {order.orderStsType === "DELIVERY_COMPLETE" && (
                                  <span style={{ marginLeft: "25px" }}>배송완료</span>
                                )}
                                </span>
                              </p>
                              <a href="/myPage/getMyProductInfo?productSeq=0">배송내역</a>
                            </td>
                            <td className="review-td">
                              {order.orderStsType === "ORDER_COMPLETE" && (
                                <button onClick={() => handleRefund(order.payment.paymentSeq)}>
                                  결제취소
                                </button>
                              )}
                              {order.orderStsType === "DELIVERY_COMPLETE" && (
                                <button onClick={() => handleReview(order.orderInfoSeq, order.productDTO.productSeq, order.productStock.productSize)}>
                                리뷰작성
                              </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="no-results">
                          <td colSpan="6">조회된 결과가 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="col-lg-12 text-center">
              {totalPages > 0 && (
                <div className="pagination__option">
                  {[...Array(totalPages)].map((_, index) => (
                    <a
                      key={index}
                      href="#"
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyOrderList;