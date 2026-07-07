import React, { useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styles from "./MyPageLayout.module.css";

type MenuItem = { label: string; to: string; desc?: string };

export default function MyPageLayout() {
    const navigate = useNavigate();
    const role = useSelector((state: RootState) => state.auth.userRole);

    const menus: MenuItem[] = useMemo(() => {
        if (role === "USER") {
            return [
                { label: "회원정보 조회", to: "/mypage/user/profile" },
                { label: "회원정보 수정", to: "/mypage/user/profile-edit" },
                { label: "비밀번호 변경", to: "/mypage/user/password" },
                { label: "회원 탈퇴", to: "/mypage/user/withdraw" },
                { label: "건강보고서 조회", to: "/health-report", desc: "바로가기" }, // 외부/다른 페이지 라우트
            ];
        }

        if (role === "ORG_MANAGER") {
            return [
                { label: "유저 관리", to: "/mypage/manager/users" },
                { label: "유저 신청 승인/거절", to: "/mypage/manager/requests" },
                { label: "병원 전용 페이지", to: "/hospital" },
            ];
        }

        if (role === "ORG_ADMIN") {
            return [{ label: "매니저/어드민 관리", to: "/mypage/admin/manage" }];
        }

        // 혹시 role이 null/예상외면 기본
        return [{ label: "마이페이지", to: "/mypage" }];
    }, [role]);

    const title =
        role === "USER" ? "마이페이지" : role === "ORG_MANAGER" ? "매니저 페이지" : role === "ORG_ADMIN" ? "관리자 페이지" : "마이페이지";

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.subTitle}>권한에 따라 사용할 수 있는 기능이 달라요.</p>
                    </div>

                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        뒤로가기
                    </button>
                </div>

                <div className={styles.body}>
                    <aside className={styles.sidebar}>
                        {menus.map((m) => (
                            <NavLink
                                key={m.to}
                                to={m.to}
                                className={({ isActive }) => (isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem)}
                            >
                                <div className={styles.menuLabel}>{m.label}</div>
                                {m.desc && <div className={styles.menuDesc}>{m.desc}</div>}
                            </NavLink>
                        ))}
                    </aside>

                    <main className={styles.content}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
