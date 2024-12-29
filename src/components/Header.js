import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ type }) => {
  const [userName, setUserName] = useState(null);
  const [searchStr, setSearchStr] = useState('');
  const navigate = useNavigate();

useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('userName');
    localStorage.removeItem('jwtToken');
    // Redirect to main page
    window.location.href = '/main';
  };

  const handleSearchClick = () => {
    document.querySelector('.search-model').style.display = 'flex';
  };

  const handleSearchClose = () => {
    document.querySelector('.search-model').style.display = 'none';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/productList?searchStr=${searchStr}`);
  };

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3 col-lg-2">
            <div className="header__logo">
              <Link to="/main">
                <h3>MoonShop</h3>
              </Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-7">
            <nav className="header__menu">
              <ul>
                <li className={!type ? 'active' : ''}><Link to="/main">Home</Link></li>
                <li className={type === 'O' ? 'active' : ''}><Link to="/productList?page=1&type=O">OUTER</Link></li>
                <li className={type === 'T' ? 'active' : ''}><Link to="/productList?page=1&type=T">TOP</Link></li>
                <li className={type === 'P' ? 'active' : ''}><Link to="/productList?page=1&type=P">PANTS</Link></li>
                <li className={type === 'S' ? 'active' : ''}><Link to="/productList?page=1&type=S">SHOES</Link></li>
                <li className={type === 'A' ? 'active' : ''}><Link to="/productList?page=1&type=A">ACCESSORIES</Link></li>
              </ul>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header__right">
              <div className="header__right__auth">
                {userName ? (
                  <Link to="/myPage">{userName}</Link>
                ) : (
                  <Link to="/login">로그인</Link>
                )}
                <a href="#" onClick={handleLogout}>로그아웃</a>
              </div>
              <ul className="header__right__widget">
                <li><span className="icon_search search-switch" onClick={handleSearchClick}></span></li>
                <li>
                  <Link to="/myHeartList">
                    <span className="icon_heart_alt"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/cartList">
                    <span className="icon_bag_alt"></span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="canvas__open">
            <i className="fa fa-bars"></i>
          </div>
          <div className="search-model">
          <div className="h-100 w-100 d-flex align-items-center justify-content-center">
            <div className="search-close-switch" onClick={handleSearchClose}>+</div>
            <form className="search-model-form" onSubmit={handleSearchSubmit}>
              <input type="text" id="searchStr" name="searchStr" placeholder="Search here....." 
              value={searchStr} onChange={(e) => setSearchStr(e.target.value)}/>
            </form>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;