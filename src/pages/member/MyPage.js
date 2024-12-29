import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from '../../components/Header';
import Side from '../../components/Side';
import './myPage.css';

const MyPage = () => {
  const [member, setMember] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");

  // Fetch member data from the server
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/member/myPage', {
          params: { userEmail: localStorage.getItem('userEmail') },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        const member = response.data.member;
        if (!member) {
          alert('Failed to fetch member info');
          return;
        }
        setMember(member);
        setProfileImage(member.profile ? member.profile.fileSeq : null);
        setEmail(member.email);
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    };

    fetchMemberInfo();
  }, []);

  const handlePasswordChange = () => {
    // Handle password change logic here
  };

  const handleProfileImageChange = (e) => {
    // Handle profile image change logic here
    const file = e.target.files[0];
    setProfileImage(URL.createObjectURL(file)); // Just an example, integrate with actual backend logic.
  };

  const handleChangeMobile = () => {
    // Handle mobile change logic here
    alert('Change mobile logic here');
  };

  const handleEmailChange = async () => {
    try {
      await axios.post('http://localhost:8080/member/updateEmail', {
        userEmail: localStorage.getItem('userEmail'),
        newEmail: email
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      alert('Email updated successfully');
      setIsEmailEditing(false);
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email');
    }
  };

  return (
    <div>
      <Header type={null} />
      <Side type={null} />
      <div className="breadcrumb-option">
          <div className="container">
              <div className="row">
                  <div className="col-lg-12">
                      <div className="breadcrumb__links">
                          <a href="./index.html"><i className="fa fa-home"></i> Home</a>
                          <span>마이페이지</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <section className="checkout spad">
        <div className="container">
          <div className="checkout__form">
            <div className="row">
              <div>
                <div className="row">
                  <div className="my-page-manage-table">
                    <table className="n-table table-row my-info-modify" style={{ width: "1000px" }}>
                      <colgroup>
                        <col width="10%" />
                        <col width="70%" />
                        <col width="30%" />
                      </colgroup>
                      <tbody>
                        <tr className="checkout__form__input my-info-img" id="profile-image-area">
                          <th scope="row">사진</th>
                          <td>
                            <form id="profile-form">
                              <input
                                type="file"
                                id="profile"
                                name="profile"
                                className="real-upload"
                                accept="image/*"
                                required
                                multiple
                                onChange={handleProfileImageChange}
                              />
                              <div className="upload-profile" id="upload-img">
                                {profileImage && <img className="image-thumbnail" src={profileImage} alt="" />}
                              </div>
                            </form>
                          </td>
                          <td className="va-b">
                            <button type="button" className="n-btn btn-sm btn-accent" onClick={handlePasswordChange}>
                              변경
                            </button>
                          </td>
                        </tr>
                        <tr className="checkout__form__input" name="cartTr">
                          <th scope="row">아이디</th>
                          <td colSpan="2">
                            <strong>{member?.memberId}</strong>
                          </td>
                        </tr>
                        <tr className="checkout__form__input" name="cartTr" id="password-area">
                          <th scope="row">비밀번호</th>
                          <td>
                            <strong>********</strong>
                          </td>
                          <td>
                            <button type="button" className="n-btn w100 btn-sm btn-default cert-hidden" onClick={() => setIsEditing(true)}>
                              비밀번호 변경
                            </button>
                          </td>
                        </tr>

                        {/* Password Change Form */}
                        {isEditing && (
                          <tr className="checkout__form__input" name="cartTr" id="change-password-area">
                            <th scope="row">비밀번호</th>
                            <td colSpan="2">
                              <div className="my-info-modify">
                                <div className="input">
                                  <label htmlFor="password">현재 비밀번호</label>
                                  <input
                                    type="password"
                                    className="n-input"
                                    id="password"
                                    value={password.currentPassword}
                                    onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                                  />
                                </div>
                                <div className="input">
                                  <label htmlFor="newPassword">신규 비밀번호</label>
                                  <input
                                    type="password"
                                    className="n-input"
                                    id="newPassword"
                                    value={password.newPassword}
                                    onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                  />
                                </div>
                                <div className="input">
                                  <label htmlFor="confirmPassword">신규 비밀번호 재 입력</label>
                                  <input
                                    type="password"
                                    className="n-input"
                                    id="confirmPassword"
                                    value={password.confirmPassword}
                                    onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                  />
                                </div>
                                <div className="btn-group">
                                  <button type="button" className="n-btn btn-sm btn-lighter" onClick={() => setIsEditing(false)}>
                                    취소
                                  </button>
                                  <button type="button" className="n-btn btn-sm btn-accent" onClick={handlePasswordChange}>
                                    완료
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Email Section */}
                        <tr className="checkout__form__input" name="cartTr" id="email-area">
                          <th scope="row">이메일</th>
                          <td>
                            {isEmailEditing ? (
                              <input
                                type="email"
                                className="n-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            ) : (
                              <strong>{email}</strong>
                            )}
                          </td>
                          <td>
                            {isEmailEditing ? (
                              <button type="button" className="n-btn w100 btn-sm btn-default cert-hidden" onClick={handleEmailChange}>
                                저장
                              </button>
                            ) : (
                              <button type="button" className="n-btn w100 btn-sm btn-default cert-hidden" onClick={() => setIsEmailEditing(true)}>
                                이메일 변경
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Mobile Section */}
                        <tr className="checkout__form__input" name="cartTr" id="mobile-area">
                          <th scope="row">휴대전화</th>
                          <td>
                            <strong>{member?.telNo}</strong>
                            <span className="certify">인증완료</span>
                          </td>
                          <td>
                            <button type="button" className="n-btn w100 btn-sm btn-default cert-hidden" onClick={handleChangeMobile}>
                              휴대전화 변경
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default MyPage;