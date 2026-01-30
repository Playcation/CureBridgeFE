// src/pages/signup/SignupPage.tsx
import React, { useState } from 'react';
import styles from './SignUp.module.css';
import EyeIcon from '../../asset/eye-icon.png';
import {signUp} from "../../api/AuthApi";
import {SignUpRequestDto} from "../../types/auth";

const SignupPage: React.FC = () => {
  // 각 입력 필드의 상태를 관리합니다.
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 입력값이 변경될 때마다 formData 상태를 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 폼 제출 시 실행될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입 정보:', formData);
    // 비밀번호와 비밀번호 확인이 일치하는지 검증
    if(formData.password.toString() !== formData.passwordConfirm.toString()) {
      alert('비밀번호와 비밀번호 확인의 입력값이 다릅니다.');
      return;
    }

    // TODO: 임의로 빈 파일 넘기는 중
    const profile: File = new File([], 'empty.txt', {type: 'text/plain'});
    // YYYY-MM-DD 형식 맞추기 위한 제로패딩
    const pad = (num: string | number) => num.toString().padStart(2, '0');
    const data: SignUpRequestDto = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phoneNumber: formData.phone,
      birthDate: `${formData.birthYear}-${pad(formData.birthMonth)}-${pad(formData.birthDay)}`
    };
    try {
      const response = await signUp(profile, data);
      console.log('회원가입 응답', response);
    } catch (error: any) {
      console.error('회원가입 api 호출 실패', error);
      console.error('에러 응답:', error.response?.data);
    }
    alert('회원가입 정보가 콘솔에 출력되었습니다.');
  };

  // 생년월일 드롭다운 옵션 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signupForm}>
        <h1 className={styles.title}>회원가입</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 이름 / 성별 */}
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>이름</label>
              <input type="text" id="name" name="name" placeholder="이름을 입력하세요." className={styles.input} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="gender" className={styles.label}>성별</label>
              <select id="gender" name="gender" className={styles.select} onChange={handleChange}>
                <option value="">성별</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>

          {/* 생년월일 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>생년월일</label>
            <div className={styles.formRow}>
              <select name="birthYear" className={styles.select} onChange={handleChange}>
                <option value="">년도</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <select name="birthMonth" className={styles.select} onChange={handleChange}>
                <option value="">월</option>
                {months.map(month => <option key={month} value={month}>{month}</option>)}
              </select>
              <select name="birthDay" className={styles.select} onChange={handleChange}>
                <option value="">일</option>
                {days.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
          </div>
          
          {/* 전화번호 */}
          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>전화번호</label>
            <div className={styles.inputWithButton}>
              <input type="tel" id="phone" name="phone" placeholder="휴대폰 번호 ( - 제외 )" className={styles.input} onChange={handleChange}/>
              <button type="button" className={styles.inlineButton}>중복확인</button>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 이메일 */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>이메일</label>
            <div className={styles.inputWithButton}>
              <input type="email" id="email" name="email" placeholder="이메일을 입력하세요." className={styles.input} onChange={handleChange}/>
              <button type="button" className={styles.inlineButton}>중복확인</button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <div className={styles.passwordInputWrapper}>
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="비밀번호를 입력하세요." className={styles.passwordInput} onChange={handleChange}/>
              <img src={EyeIcon} alt="show password" className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}/>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.inputGroup}>
            <label htmlFor="passwordConfirm" className={styles.label}>비밀번호 확인</label>
            <div className={styles.passwordInputWrapper}>
              <input type={showPasswordConfirm ? 'text' : 'password'} id="passwordConfirm" name="passwordConfirm" placeholder="비밀번호를 다시 입력하세요." className={styles.passwordInput} onChange={handleChange}/>
              <img src={EyeIcon} alt="show password confirm" className={styles.eyeIcon} onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}/>
            </div>
          </div>

          {/* 회원가입' */}
          <button type="submit" className={styles.submitButton}>회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;