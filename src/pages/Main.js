import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../css/main.css';

function Main() {
  const [productCount, setProductCount] = useState({
    O: 0,
    T: 0,
    S: 0,
    P: 0,
    A: 0
  });
  const [productList, setProductList] = useState([]);
  const [productType, setProductType] = useState([]);
  const [type, setType] = useState('');
  const [user, setUser] = useState({ name: 'User' }); // 사용자 정보
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await axios.get('http://localhost:8091/main');
      const data = response.data;
      setProductList(data.productList.content);
      setProductCount(data.productCount);
      setProductType(data.productType);
      setType(data.type);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleProductClick = (productSeq) => {
    // 특정 productSeq를 가진 ProductInfo 페이지로 이동
    navigate(`/productInfo/${productSeq}`);
  };

  return (
    <div>
      <Header type={null} />
      
      <section className="categories">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6 p-0">
                    <div className="categories__item categories__large__item set-bg" style={{ backgroundImage: "url(img/categories/category1.jpg)" }}>
                        <div className="categories__text">
                            <h1>Outer</h1>
                            <p className="title-description">{productCount.O} items</p>
                            <Link to="/productList?page=1&type=O">Shop now</Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item set-bg" style={{ backgroundImage: "url(img/categories/category2.jpg)" }}>
                                <div className="categories__text">
                                    <h4>Top</h4>
                                    <p className="title-description">{productCount.T} items</p>
                                    <Link to="/productList?page=1&type=T">Shop now</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item set-bg" style={{ backgroundImage: "url(img/categories/category3.jpg)" }}>
                                <div className="categories__text">
                                    <h4>Shoes</h4>
                                    <p className="title-description">{productCount.S} items</p>
                                    <Link to="/productList?page=1&type=S">Shop now</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item set-bg" style={{ backgroundImage: "url(img/categories/category4.jpg)" }}>
                                <div className="categories__text">
                                    <h4>Pants</h4>
                                    <p className="title-description">{productCount.P} items</p>
                                    <Link to="/productList?page=1&type=P">Shop now</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item set-bg" style={{ backgroundImage: "url(img/categories/category5.jpg)" }}>
                                <div className="categories__text">
                                    <h4>Accessories</h4>
                                    <p className="title-description">{productCount.A} items</p>
                                    <Link to="/productList?page=1&type=A">Shop now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="product spad">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-4">
                    <div className="section-title">
                        <h4>New product</h4>
                    </div>
                </div>
                <div className="col-lg-8 col-md-8">
                    <ul className="filter__controls">
                        <li className="active" data-filter="*">All</li>
                        <li data-filter=".outer">Outer</li>
                        <li data-filter=".top">Top</li>
                        <li data-filter=".pants">Pants</li>
                        <li data-filter=".shoes">Shoes</li>
                        <li data-filter=".accessories">Accessories</li>
                    </ul>
                </div>
            </div>
            <div className="row property__gallery">
                {productList.map(product => (
                    <div className="col-lg-3 col-md-4 col-sm-6 mix men" key={product.productSeq}>
                        <div className="product__item">
                            <div className="product__item__pic set-bg" 
                            onClick={() => handleProductClick(product.productSeq)} 
                            style={{ 
                              backgroundImage: `url(http://localhost:8080/member/fileDownload?fileSeq=${product.productFileList[0].file.fileSeq})`
                            }} >
                                <div className="label new">New</div>
                                <ul className="product__hover">
                                    <li><a href="img/product/product-1.jpg" className="image-popup"><span className="arrow_expand"></span></a></li>
                                    <li>
                                        <a href="#" className="heartIcn" id={product.productSeq}>
                                            {product.heart == null ? <span className="icon_heart_alt"></span> : <span className="icon_heart" style={{color: 'red'}}></span>}
                                        </a>
                                    </li>
                                    <li><a href="#"><span className="icon_bag_alt"></span></a></li>
                                </ul>
                            </div>
                            <div className="product__item__text">
                                <h6><a href="#">{product.productName}</a></h6>
                                <div className="product__price">{new Intl.NumberFormat().format(product.price)} 원</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>

      <footer>
        <p>&copy; 2023 Your Company</p>
      </footer>
    </div>
  );
}

export default Main;