import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import './productList.css';

const CategoryCard = ({ category }) => (
    <div className="card">
        <div className="card-heading">
            <a className="collapsed" data-toggle="collapse" href={`#collapse${category.title}`} aria-expanded="false" aria-controls={`collapse${category.title}`}>
                {category.title}
            </a>
        </div>
        <div id={`collapse${category.title}`} className="collapse" data-parent="#accordionExample">
            <div className="card-body">
                <ul>
                    {category.subcategories.map((subcategory, index) => (
                        <li key={index}><a href="#">{subcategory}</a></li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const ProductList = () => {
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const type = searchParams.get('type') || '';
    const page = searchParams.get('page') || 1;
    const searchStr = searchParams.get('searchStr') || '';

    const SidebarCategories = () => {
        return [
          { title: '아우터', subcategories: ['카디건', '코트', '자켓', '패딩', '파카'] },
          { title: '상의', subcategories: ['니트', '티셔츠', '셔츠'] },
          { title: '바지', subcategories: ['면바지', '데님바지', '트레이닝바지'] },
          { title: '신발', subcategories: ['부츠', '운동화', '구두'] },
          { title: '악세사리', subcategories: ['가방', '목걸이', '시계'] },
        ];
    };

    const fetchProductData = useCallback(async (page, type) => {
        try {
            const response = await axios.get('http://localhost:8080/product/getProductList', {
                params: {
                  page: page,
                  type: type,
                  searchStr: searchStr
                }, 
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                  'Content-Type': 'application/json'
                }
              });   
            const data = response.data
            setProductList(data.productList.content);
            setTotalPage(data.productList.totalPages);
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
    }, [navigate, searchStr]);

    useEffect(() => {
        fetchProductData(page, type);
    }, [page, type, fetchProductData]);

    const categories = SidebarCategories();

    return (
        <div className="App">
            {/* Header Section */}
            <Header type={type} />

            {/* Breadcrumb */}
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/index.html"><i className="fa fa-home"></i> Home</Link>
                                <span>Shop</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Section */}
            <section className="shop spad">
                <div className="container">
                    <div className="row">
                    <div className="col-lg-3 col-md-3">
                        <div className="shop__sidebar">
                        
                        <div className="sidebar__categories">
                            <div className="section-title">
                                <h4>Categories</h4>
                            </div>
                            <div className="categories__accordion">
                                <div className="accordion" id="accordionExample">
                                    {categories.map((category, index) => (
                                        <CategoryCard key={index} category={category} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>

                    <div className="col-lg-9 col-md-9">
                        <div className="row">
                            {productList.map(product => (
                                <div className="col-lg-4 col-md-6" key={product.productSeq}>
                                    <div className="product__item">
                                        <div className="product__item__pic">
                                            <Link to={`/productInfo/${product.productSeq}`}>
                                                <img src={`http://localhost:8080/member/fileDownload?fileSeq=${product.productFileList[0].file.fileSeq}`} alt={product.productName} />
                                            </Link>
                                        </div>
                                        <div className="product__item__text">
                                            <h6><Link to={`/productInfo/${product.productSeq}`}>{product.productName}</Link></h6>
                                            <div className="product__price">{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.price)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="col-lg-12 text-center">
                                <div className="pagination__option">
                                    {Array.from({ length: totalPage }, (_, index) => (
                                        <Link 
                                            key={index + 1} 
                                            to={`/productList?page=${index + 1}&type=${type}`} 
                                            onClick={() => setCurrentPage(index + 1)} 
                                            className={currentPage === index + 1 ? 'active' : ''}>
                                            {index + 1}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProductList;