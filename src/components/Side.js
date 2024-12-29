import React, { useState, useEffect } from 'react';
import '../css/side.css';

const Side = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace("myReviewInfo", "myOrderList");
    const urls = ["myPage", "myOrderList", "myHeartList"];

    urls.forEach(url => {
      const urlEle = document.getElementById(url);
      if (currentUrl.includes("/myPage/" + url)) {
        urlEle.className = 'nav-link';
      } else {
        urlEle.className = 'nav-link collapsed';
      }
    });
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link" id="myPage" href="/myPage">
            <i className="bi bi-grid"></i>
            <span>마이페이지</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" id="myOrderList" href="/myOrderList">
            <i className="bi bi-menu-button-wide"></i>
            <span>주문내역관리</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" id="myHeartList" href="/myHeartList">
            <i className="bi bi-layout-text-window-reverse"></i>
            <span>좋아요</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Side;
