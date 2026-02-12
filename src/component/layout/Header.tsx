// src/component/layout/Header.tsx

import React, { useState } from 'react';
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
  const dispatch = useDispatch();

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
              <img src={UserIcon} alt="프로필" />
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