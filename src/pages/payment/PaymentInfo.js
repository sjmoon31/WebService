import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';

const PaymentInfo = () => {
  const { IMP } = window;
  const [myCartList, setMyCartList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [member, setMember] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/order/getPaymentInfo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        setMyCartList(response.data.myCartList);
        setTotalPrice(response.data.totalPrice);
        setMember(response.data.member);
        setFinalPrice(response.data.totalPrice);
      } catch (error) {
        console.error('Error fetching payment info:', error);
      }
    };

    fetchPaymentInfo();
  }, []);

  const getPayment = () => {
    if (typeof IMP === 'undefined') {
      alert('Iamport script is not loaded.');
      return;
    }

    //가맹점 식별코드
    IMP.init("imp17552170");
    const memberNm = document.getElementById("memberNm").value;
    const address = document.getElementById("address").value + " " + document.getElementById("detailAddress").value;
    const zipCode = document.getElementById("zip-code").value;
    const telNo = document.getElementById("tel-no").value;
    const email = document.getElementById("email").value;
    const memberCouponElements = document.getElementsByName("sel-coupon");

    const memberCouponSeqList = [];
    for (const sel of memberCouponElements) {
      memberCouponSeqList.push(sel.value);
    }

    let params = {
      "totalPrice": totalPrice,
      "payType": "CARD",
      "address": address,
      "cartSeqList": myCartList.map((cart) => cart.cartSeq),
      "memberCouponSeqList": memberCouponSeqList
    };

    IMP.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: 'merchant_' + new Date().getTime(), // 상점에서 관리하는 주문 번호를 전달
        name: '주문명:결제테스트',
        amount: totalPrice,
        buyer_email: email,
        buyer_name: memberNm,
        buyer_tel: telNo,
        buyer_addr: address,
        buyer_postcode: zipCode
      },
      function (rsp) { // callback
        params.impUid = rsp.imp_uid;
        axios.post('http://localhost:8080/order/savePaymentInfo', params, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then(() => {
          alert("결제완료");
        });
      }
    );
  };

  return (
    <div>
      <Header type={null} />
      <section className="checkout spad">
        <div className="container">
          <form className="checkout__form">
            <div className="row">
              <div className="col-lg-8">
                <h5>결제 세부정보</h5>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="checkout__form__input">
                      <p>이름 <span>*</span></p>
                      <input type="text" id="memberNm" defaultValue={member.name || ''} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="checkout__form__input">
                      <p>주소 <span>*</span></p>
                      <input type="text" id="address" placeholder="주소" defaultValue={member.address || ''} />
                      <input type="text" id="detailAddress" placeholder="상세주소" defaultValue={member.detailAddress || ''} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="checkout__form__input">
                      <p>우편번호 <span>*</span></p>
                      <input type="text" id="zip-code" placeholder="우편번호" defaultValue={member.zipCode || ''} readOnly />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="checkout__form__input">
                      <p>연락처 <span>*</span></p>
                      <input type="text" id="tel-no" defaultValue={member.telNo || ''} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="checkout__form__input">
                      <p>이메일 <span>*</span></p>
                      <input type="text" id="email" defaultValue={member.email || ''} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="checkout__order">
                  <h5>주문 목록</h5>
                  <div className="checkout__order__product">
                    <ul>
                      <li>
                        <span className="top__text">상품</span>
                        <span className="top__text__right">총금액</span>
                      </li>
                      {myCartList.map((cart, index) => (
                        <li key={index}>
                          {index + 1}. {cart.productDTO.productName} × {cart.quantity}
                          <span>₩{(cart.productDTO.price * cart.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="checkout__order__total">
                    <ul>
                      <li>
                        상품금액 <span>₩{totalPrice.toLocaleString()}</span>
                      </li>
                      <li>
                        결제금액 <span>₩{finalPrice.toLocaleString()}</span>
                      </li>
                    </ul>
                    <input type="hidden" id="tot-price"/>
                  </div>
                  <button type="button" className="site-btn" onClick={getPayment}>
                    결제하기
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PaymentInfo;