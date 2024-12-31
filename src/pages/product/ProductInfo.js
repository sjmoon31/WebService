import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import Header from '../../components/Header';
import ProductReview from './ProductReview';
import './productInfo.css';

const ProductInfo = () => {
  const {productSeq} = useParams(); // useParams 훅을 사용하여 URL 파라미터에서 productSeq를 가져옵니다.
  const [product, setProduct] = useState(null);
  const [reviewInfo, setReviewInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // 현재 선택된 이미지 인덱스
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data from API
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/product/getProductInfo`, {
          params: { productSeq: productSeq }, 
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
        });
        setProduct(response.data.product);
        setReviewInfo(response.data.reviewInfo);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('로그인이 필요합니다.');
          localStorage.removeItem('userName');
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } else {
          console.error('Error fetching product data:', error);
        }
      }
    };

    fetchProductData();
  }, [productSeq]);

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const handleSizeChange = (event) => {
    setSelectedSize(parseInt(event.target.value));
  };

  const addToCart = async () => {
    if (!selectedSize) {
      alert("사이즈를 선택해주세요");
      return;
    }

    const token = localStorage.getItem('jwtToken');
    const email = localStorage.getItem('userEmail');

    try {
      await axios.post('http://localhost:8080/order/addCartInfo', {
          productStockSeq: selectedSize,
          quantity: quantity
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
      });
      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  const toggleHeart = async () => {
    try {
      const updateYn = product.heart ? 'N' : 'Y';
      const token = localStorage.getItem('jwtToken');
      const email = localStorage.getItem('userEmail');

      await axios.post('http://localhost:8080/product/updateHeartInfo', {
        productSeq: product.productSeq,
        updateYn: updateYn
      }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
      });
      setProduct(prevProduct => ({
        ...prevProduct,
        heart: !prevProduct.heart
      }));
    } catch (error) {
      console.error('Error updating heart info:', error);
      alert("찜하기 상태 변경에 실패했습니다.");
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      <Header type={null} />
      <section className="productInfo spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product__details__pic">
                <div className="product__details__pic__left product__thumb">
                  <div className="thumbnail__scroll">
                    {product.productFileList.map((file, index) => (
                      <a
                        key={index}
                        className={`pt ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          src={`http://localhost:8080/member/fileDownload?fileSeq=${file.file.fileSeq}`}
                          alt="Thumbnail"
                        />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="product__details__slider__content">
                  <Swiper
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    slidesPerView={1}
                    spaceBetween={10}
                    navigation={true}
                    loop={true}
                    initialSlide={activeIndex}
                  >
                    {product.productFileList.map((file, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={`http://localhost:8080/member/fileDownload?fileSeq=${file.file.fileSeq}`}
                          alt="Product Image"
                          className="product__big__img"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="product__details__text">
                <h3>{product.productName}</h3>
                {reviewInfo && (
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={reviewInfo.scoreAvg > i ? 'fa fa-star' : ''}></i>
                    ))}
                    <span>({reviewInfo.reviewCount} reviews)</span>
                  </div>
                )}

                <div className="product__details__price">
                  {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.price)}
                </div>

                <div className="product__details__button">
                  <div className="quantity">
                    <span>수량:</span>
                    <div className="pro-qty">
                      <span className="dec qtybtn" onClick={() => handleQuantityChange(-1)}>-</span>
                      <input type="text" value={quantity} readOnly />
                      <span className="inc qtybtn" onClick={() => handleQuantityChange(1)}>+</span>
                    </div>
                  </div>

                  <button onClick={addToCart} className="cart-btn">
                    <span className="icon_bag_alt"></span>장바구니 추가
                  </button>

                  <ul>
                    <li>
                      <a onClick={toggleHeart} className="heartIcn">
                        <span className={product.heart ? 'icon_heart' : 'icon_heart_alt'}></span>
                      </a>
                    </li>
                    <li><a href="#"><span className="icon_adjust-horiz"></span></a></li>
                  </ul>
                </div>

                <div className="product__details__widget">
                  <ul>
                    <li>
                      <span>Availability:</span>
                      <label>
                        In Stock
                        <input type="checkbox" defaultChecked />
                      </label>
                    </li>
                    <li>
                      <span>사이즈:</span>
                      <div className="size__btn">
                        {product.productStockList.map((stock, index) => (
                          <label
                            key={index}
                            className={selectedSize === stock.productStockSeq ? 'active' : ''}
                          >
                            <input
                              type="radio"
                              name="size"
                              value={stock.productStockSeq}
                              onChange={handleSizeChange}
                            />
                            {stock.productSize}
                          </label>
                        ))}
                      </div>
                    </li>
                    <li>
                      <span>Promotions:</span>
                      <p>Free shipping</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="product__details__tab">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                      onClick={() => handleTabClick('description')}
                    >
                      Description
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => handleTabClick('reviews')}
                    >
                      Reviews
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`} id="tabs-1">
                    {product.productContent ? <p>{product.productContent}</p> : <h5 className="no-description">상품 설명이 없습니다.</h5>}
                  </div>
                  <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`} id="tabs-2">
                    <ProductReview productSeq={productSeq} productName={product.productName} productFileSeq={product.productFileList[0].file.fileSeq}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductInfo;