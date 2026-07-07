// src/pages/mypage/MyPageRedirect.tsx
// 헤더의 "마이페이지" 클릭 시 role에 따라 적절한 마이페이지로 리다이렉트
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const MyPageRedirect = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        switch (userRole) {
            case 'USER':
                navigate('/mypage/user/profile', { replace: true });
                break;
            case 'ORG_MANAGER':
                navigate('/mypage/manager', { replace: true });
                break;
            case 'ORG_ADMIN':
                navigate('/mypage/org_admin', { replace: true });
                break;
            case 'ADMIN':
                navigate('/mypage/user/profile', { replace: true }); // ADMIN도 USER 마이페이지 사용
                break;
            default:
                navigate('/login', { replace: true });
        }
    }, [isAuthenticated, userRole, navigate]);

    return null;
};

export default MyPageRedirect;
