import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './productReview.css'; // Assuming you have a CSS file for custom styles

const ProductReview = ({ productSeq, productName, productFileSeq }) => {
  const [reviewList, setReviewList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('new');

  // Review data fetch function
  const fetchReviews = async (page = 1) => {
    try {
      const response = await axios.get(`http://localhost:8080/product/getReviewList`, {
        params: { productSeq, page, sort: sortOption },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      });
      setReviewList(response.data.reviewList.content);
      setTotalPages(response.data.reviewList.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productSeq, sortOption]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle pagination click
  const handlePageChange = (page) => {
    fetchReviews(page);
  };

  return (
    <div className="product-review">
      <div className="review-header">
        <h3>상품 리뷰</h3>
        <div className="review-sort">
          <label htmlFor="reviewSelectSort">Sort by:</label>
          <select
            id="reviewSelectSort"
            className="review-select-sort"
            onChange={handleSortChange}
            value={sortOption}
          >
            <option value="new">Newest</option>
            <option value="comment_cnt_desc">Most Commented</option>
            <option value="up_cnt_desc">Most Recommended</option>
            <option value="goods_est_desc">Highest Rated</option>
            <option value="goods_est_asc">Lowest Rated</option>
          </select>
        </div>
      </div>

      <div className="review-list-wrap">
        {totalPages > 0 ? (
          reviewList.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-profile">
                <img
                  className="review-profile-img"
                  src="/img/common/profile.png"
                  alt="Profile"
                />
                <div className="review-profile-info">
                  <span className="review-profile-name">{review.orderInfo.member.nickName}</span>
                  <span className="review-profile-date">
                    {new Date(review.regDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="product-review-content">
                <div className="review-product-info">
                  <img
                    className="review-product-img"
                    src={`/fileDownload?fileSeq=${productFileSeq}`}
                    alt="Product"
                  />
                  <span className="review-product-name">
                    {productName} {review.orderInfo.productStock.productSize} 구매
                  </span>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa fa-star ${i < review.score ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <p className="review-text">{review.content}</p>
                {review.file && (
                  <div className="review-image">
                    <img
                      src={`/fileDownload?fileSeq=${review.file.fileSeq}`}
                      alt="Review"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <h5>리뷰가 없습니다.</h5>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <a
              key={index}
              href="#"
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReview;