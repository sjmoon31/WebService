import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Side from '../../components/Side';
import './myHeart.css';

const MyHeartList = () => {
    const [myHeartList, setMyHeartList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchHeartList = useCallback(async (page) => {
        setLoading(true);

        const token = localStorage.getItem('jwtToken');
        
        axios.get('http://localhost:8080/product/getMyHeartList', {
            params: {
                page: page
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
          setMyHeartList(response.data.myHeartList.content);
          setTotalPages(response.data.myHeartList.totalPages);
          setLoading(false);
        })
        .catch((err) => {
            setLoading(false);
            if(err.response && err.response.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/login');
            } else {
                console.error('좋아요 목록을 불러오는 중 오류가 발생했습니다.');
            }
        });
    }, [navigate]);

    useEffect(() => {
        fetchHeartList(currentPage);
    }, [currentPage, fetchHeartList]);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
    <div>
      <Header type={null} />
      <Side type={null} />
        <div className="heart-list">
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="breadcrumb__links">
                        <a href="/index.html"><i className="fa fa-home"></i> Home</a>
                        <span>좋아요</span>
                    </div>
                </div>
            </div>
            <section className="heart-manage spad">
                <div className="container">
                    {loading && <div>Loading...</div>}
                    {totalPages > 0 ? (
                        <div className="row">
                            {myHeartList.map((heart, index) => (
                                <div 
                                    className="trend__item" 
                                    key={index} 
                                    onClick={() => window.location.href = `/productInfo/${heart.productSeq}`}
                                >
                                    <div className="trend__item__pic product__details__pic__left" style={{ width: '50%' }}>
                                        <img 
                                            src={`http://localhost:8080/member/fileDownload?fileSeq=${heart.productImgFlSeq}`} 
                                            alt="Product" 
                                        />
                                    </div>
                                    <div className="trend__item__text" style={{ width: '50%', marginTop: '3px' }}>
                                        <h6>{heart.productName}</h6>
                                        <div className="product__price">
                                            {Number(heart.price).toLocaleString()}원
                                        </div>
                                        <span className="icon_heart" style={{ color: 'red' }}></span>
                                        <span style={{ color: 'red', marginLeft: '5px' }}>{heart.heartCnt}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">조회된 결과가 없습니다.</div>
                    )}

                    {totalPages > 1 && (
                        <div className="col-lg-12 text-center">
                            <div className="pagination__option">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <a 
                                        key={index + 1} 
                                        href="#"
                                        className={currentPage === index + 1 ? 'active' : ''}
                                        onClick={() => handlePageClick(index + 1)}
                                    >
                                        {index + 1}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    </div>
    );
};

export default MyHeartList;
