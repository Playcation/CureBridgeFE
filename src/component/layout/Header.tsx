// src/component/layout/Header.tsx

import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

// Redux 연동을 위한 import
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store'; 
import { logout } from '../../store/slices/authSlice'; 

// 아이콘 import
import NotificationIcon from '../../asset/notification.png';
import SettingsIcon from '../../asset/settings.png';
import UserIcon from '../../asset/profile.png';
import {getMember} from "../../api/MemberApi";
import {setProfile, setUserDetails} from "../../store/slices/userSlice";

const navItems = [
  { name: '공지사항', path: '/notice' },
  { name: '의학뉴스', path: '/news' },
  { name: '상담하기', path: '/consult' },
  { name: '문의하기', path: '/support' },
  { name: '마이페이지', path: '/mypage' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user); // userSlice 데이터 사용
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const response = await getMember();

          // 백엔드 UserResponseDto 구조에 맞춰 데이터 저장
          dispatch(setUserDetails(response.data));
          if (response.data.profileUrl) {
            dispatch(setProfile({ ...response.data, profileUrl: response.data.profileUrl }));
          }
        } catch (error) {
          console.error("유저 정보를 불러오는데 실패했습니다.", error);
        }
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, user.name, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    alert('로그아웃 되었습니다.');
  };

  return (
    <header className={styles.headerContainer}>
      <Link to="/" className={styles.logoLink}>
        <img src="/logo.png" alt="MindBridge Logo" className={styles.logo} />
      </Link>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} className={styles.navItem}>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className={styles.userActions}>
        {isAuthenticated ? (
          // --- 로그인 상태일 때 ---
          <>
            <button className={styles.iconButton}>
              <img src={NotificationIcon} alt="알림" />
            </button>
            <Link to="/mypage" className={styles.avatar}>
              {/*<img src={UserIcon} alt="프로필" />*/}
              <img
                  src={user.profileUrl || UserIcon} // URL이 있으면 출력, 없으면 기본 아이콘
                  alt="프로필"
                  className={styles.profileImg} // 원형 스타일을 위한 클래스 추가
                  onError={(e) => { e.currentTarget.src = UserIcon; }} // 이미지 로드 실패 시 처리
              />
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </>
        ) : (
          // --- 로그아웃 상태일 때 ---
          <Link to="/login" className={styles.loginLinkButton}>
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;