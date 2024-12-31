import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './join.module.css';

function Join() {
  const [memberName, setMemberName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [phoneNumber3, setPhoneNumber3] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailUnique, setIsEmailUnique] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isEmailUnique) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }
    const telNo = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;
    if (!validatePhoneNumber(telNo)) {
      alert('유효하지 않은 전화번호입니다.');
      return;
    }
    const name = memberName;
    try {
      const response = await axios.post('http://localhost:8080/member/join', { name, email, password, userName, telNo, address, zipCode, detailedAddress });
      alert('회원가입 성공');
      navigate('/login');
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  const checkEmailDuplication = async () => {
    try {
      const response = await axios.post('http://localhost:8080/member/emailDupChk', { email });
      if (response.data.isUnique) {
        setIsEmailUnique(true);
        alert('사용 가능한 이메일입니다.');
      } else {
        setIsEmailUnique(false);
        alert('이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
    }
  };

  const sendEmailVerificationCode = async () => {
    try {
      await axios.post('http://localhost:8080/member/sendEmailVerificationCode', { email });
      alert('이메일 인증번호가 발송되었습니다.');
      setIsEmailVerificationSent(true);
    } catch (error) {
      console.error('이메일 인증번호 발송 오류:', error);
    }
  };

  const verifyEmailCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/member/verifyEmailCode', { email, emailVerificationCode });
      if (response.data.isVerified) {
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('유효하지 않은 인증번호입니다.');
      }
    } catch (error) {
      console.error('이메일 인증 오류:', error);
    }
  };

  const sendVerificationCode = async () => {
    const phoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;
    if (!validatePhoneNumber(phoneNumber)) {
      alert('유효하지 않은 전화번호입니다.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/member/sendVerificationCode', { phoneNumber });
      alert('인증번호가 발송되었습니다.');
      setIsVerificationSent(true);
    } catch (error) {
      console.error('인증번호 발송 오류:', error);
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setZipCode(data.zonecode);
        setAddress(data.address);
      }
    }).open();
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailUnique(false);
    setIsEmailVerificationSent(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.userBox}>
            <input type="text" name="memberName" required value={memberName} onChange={(e) => setMemberName(e.target.value)} />
            <label>Name</label>
          </div>
          <div className={styles.emailBox}>
            <input type="email" name="email" required value={email} onChange={handleEmailChange} />
            <label>Email</label>
          </div>
          {!isEmailUnique ? (
            <button type="button" className={styles.emailCheckButton} onClick={checkEmailDuplication}>이메일 중복 확인</button>
          ) : (
            <button type="button" className={`${styles.emailCheckButton} ${styles.emailVerificationButton}`} onClick={sendEmailVerificationCode}>이메일 인증번호 보내기</button>
          )}
          {isEmailVerificationSent && (
            <div className={styles.userBox}>
              <input type="text" name="emailVerificationCode" required value={emailVerificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} />
              <label>Verification Code</label>
              <button type="button" onClick={verifyEmailCode}>인증번호 확인</button>
            </div>
          )}
          <div className={styles.userBox}>
            <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Password</label>
          </div>
          <div className={styles.userBox}>
            <input type="password" name="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <label>Confirm Password</label>
          </div>
          <div className={styles.phoneNumberContainer}>
            <label htmlFor="phoneNumber1">Phone Number</label>
            <input type="text" id="phoneNumber1" name="phoneNumber1" required value={phoneNumber1} onChange={(e) => setPhoneNumber1(e.target.value)} maxLength="3" placeholder="000" />
            <span>-</span>
            <input type="text" id="phoneNumber2" name="phoneNumber2" required value={phoneNumber2} onChange={(e) => setPhoneNumber2(e.target.value)} maxLength="4" placeholder="0000" />
            <span>-</span>
            <input type="text" id="phoneNumber3" name="phoneNumber3" required value={phoneNumber3} onChange={(e) => setPhoneNumber3(e.target.value)} maxLength="4" placeholder="0000" />
          </div>
          <div className={styles.addressContainer}>
            <label>Postal Code</label>
            <input type="text" name="zipCode" required value={zipCode} readOnly />
          </div>
          <button type="button" className={styles.addressSearchButton} onClick={handleAddressSearch}>우편번호 검색</button>
          <div className={styles.addressContainer}>
          <label>Address</label>
            <input type="text" name="address" required value={address} readOnly />
          </div>
          <div className={styles.addressContainer}>
            <label>Detailed Address</label>
            <input type="text" name="detailedAddress" required value={detailedAddress} onChange={(e) => setDetailedAddress(e.target.value)} />
          </div>
          <button className={styles.joinBtn} type="submit">회원가입</button>
        </form>
        <div className={styles.buttonContainer}>
          <Link to="/main" className={styles.linkButton}>메인페이지</Link>
          <Link to="/login" className={styles.linkButton}>로그인</Link>
        </div>
      </div>
    </div>
  );
}

export default Join;