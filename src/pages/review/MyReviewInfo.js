import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Side from '../../components/Side';
import './myReview.css';

const MyReviewInfo = () => {
    const {orderInfoSeq} = useParams(0);
    const {productSeq} = useParams(0);
    const {sizeType} = useParams('');
    const [reviewSeq, setReviewSeq] = useState(0);
    const [product, setProduct] = useState({});
    const [productFileSeq, setProductFileSeq] = useState(0);
    const [reviewInfo, setReviewInfo] = useState({ score: 0, content: '', file: null });
    const [rating, setRating] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        fetchReviewInfo(orderInfoSeq, productSeq, sizeType);
    }, [orderInfoSeq, productSeq, sizeType]);

    const fetchReviewInfo = (orderInfoSeq, productSeq, sizeType) => {
        // Fetch initial data for orderInfo, reviewInfo, and product
        axios.get('http://localhost:8080/product/getMyReviewInfo',{
            params: {
                orderInfoSeq: orderInfoSeq,
                productSeq: productSeq,
                sizeType: sizeType
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response => {
            const { product, reviewInfo } = response.data;
            setProduct(product);
            setProductFileSeq(product.productFileList[0].file.fileSeq);
            setReviewInfo(reviewInfo);
            setReviewSeq(reviewInfo.reviewSeq);
            setRating(reviewInfo.score);
        })
        .catch(error => {
            console.error('Error fetching review info:', error);
        });

    }

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);

        // 이미지 미리보기
        const previewContainer = document.getElementById('upload-img');
        previewContainer.innerHTML = ''; // 기존 미리보기 초기화

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'upload';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handleContentChange = (event) => {
        setReviewInfo({ ...reviewInfo, content: event.target.value });
    };

    const saveMyReview = () => {
        const formData = new FormData();
        formData.append('reviewSeq', reviewSeq || 0);
        formData.append('orderInfoSeq', orderInfoSeq);
        formData.append('content', reviewInfo.content);
        formData.append('score', rating);

        Array.from(selectedFiles).forEach(file => {
            formData.append('imgFile', file);
        });

        axios.post('http://localhost:8080/product/saveMyReview', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert('리뷰가 정상적으로 등록되었습니다.');
        })
        .catch(error => {
            alert('리뷰 등록에 실패하였습니다.');
        });
    };

    return (
        <div>
            <Header type={null} />
            <Side type={null} />
            <div className="container">
                <div className="breadcrumb-option">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <a href="/index.html"><i className="fa fa-home"></i> Home</a>
                                <span>리뷰 작성</span>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="checkout spad">
                    <div className="checkout__form">
                        <h5>리뷰 등록 화면</h5>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="review-goods-information">
                                    <div className="review-goods-information__thumbnail">
                                        <img className="product-img" src={`http://localhost:8080/member/fileDownload?fileSeq=${productFileSeq}`} alt="Product" />
                                    </div>
                                    <div className="review-goods-information__item">
                                        <p className="review-goods-information__option-wrap">{`${product.productName || ''} ${sizeType || ''}`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="checkout__form__input review-title">
                                    <p>별점을 선택해 주세요.</p>
                                </div>
                                <div className="rating">
                                    {[1, 2, 3, 4, 5].map(starNum => (
                                        <React.Fragment key={starNum}>
                                            <input 
                                                type="checkbox" 
                                                name="rating" 
                                                className="rate-radio"
                                                id={`rating${starNum}`} 
                                                value={starNum} 
                                                checked={starNum <= rating} 
                                                onChange={() => handleRatingChange(starNum)} 
                                                title={`${starNum}점`} 
                                            />
                                            <label htmlFor={`rating${starNum}`}></label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="checkout__form__input review-title">
                                    <p>상품 후기</p>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <textarea 
                                    className="review-content" 
                                    id="review-content" 
                                    value={reviewInfo.content || ''} 
                                    onChange={handleContentChange} 
                                ></textarea>
                            </div>
                            <div className="col-lg-12">
                                <div className="checkout__form__input review-title">
                                    <p>리뷰사진 <span>*</span></p>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <form id="review-image-form" onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
                                    <div className="upload" id="upload-img">
                                        {reviewInfo.file && <img src={`/fileDownload?fileSeq=${reviewInfo.file.fileSeq}`} alt="Review" />}
                                    </div>
                                    <input 
                                        type="file" 
                                        id="file-img" 
                                        name="file-img" 
                                        accept="image/*" 
                                        required 
                                        multiple 
                                        onChange={handleFileChange} 
                                    />
                                </form>
                            </div>
                            <button 
                                type="button" 
                                className="site-btn review-btn" 
                                id="save-btn" 
                                onClick={saveMyReview}
                            >
                                리뷰등록
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyReviewInfo;
