// src/pages/support/SupportListPage.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./SupportListPage.module.css";
import { fetchSupports, searchSupportByAll, searchSupportByTitle } from "../../api/SupportApi";
import { selectCurrentUserId, selectIsAdmin } from "../../store/slices/authSlice";
import SupportSearchBar from "../../component/support/SupportSearchBar";

function SupportListPage() {
    const myUserId = useSelector(selectCurrentUserId);
    const isAdmin = useSelector(selectIsAdmin);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [totalCount, setTotalCount] = useState(0);
    const [items, setItems] = useState<any[]>([]);

    const [searchType, setSearchType] = useState<"title" | "all" | null>(null);
    const [keyword, setKeyword] = useState("");

    const totalPages = useMemo(() => Math.ceil(totalCount / size), [totalCount, size]);

    const normalizePaging = (res: any) => {
        const content = res?.content ?? res?.data ?? res?.list ?? [];
        const total = res?.totalElements ?? res?.totalCount ?? res?.total ?? content.length;
        return { content, total };
    };

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = searchType
                ? searchType === "title"
                    ? await searchSupportByTitle(keyword, page, size)
                    : await searchSupportByAll(keyword, page, size)
                : await fetchSupports(page, size);

            const normalized = normalizePaging(res);
            setItems(normalized.content);
            setTotalCount(normalized.total);
        } catch (e) {
            console.error(e);
            setError("문의 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }, [page, size, searchType, keyword]);

    useEffect(() => {
        load();
    }, [load]);

    const onSearch = (type: "title" | "all", kw: string) => {
        const trimmed = kw.trim();
        if (!trimmed) {
            setSearchType(null);
            setKeyword("");
            setPage(0);
            return;
        }
        setSearchType(type);
        setKeyword(trimmed);
        setPage(0);
    };

    if (loading) return <div className={styles.status}>불러오는 중...</div>;
    if (error) return <div className={styles.status} style={{ color: "red" }}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <h2 className={styles.title}>문의하기</h2>

                {/* ✅ 작성은 로그인 유저만 */}
                {myUserId ? (
                    <Link to="/support/create" className={styles.writeButton}>문의 작성</Link>
                ) : (
                    <button className={styles.writeButtonDisabled} onClick={() => alert("로그인 후 작성할 수 있어요.")}>
                        문의 작성
                    </button>
                )}
            </div>

            <SupportSearchBar onSearch={onSearch} loading={loading} />

            <div className={styles.countRow}>총 {totalCount}건</div>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th style={{ width: "12%" }}>번호</th>
                    <th style={{ width: "58%" }}>제목</th>
                    <th style={{ width: "15%" }}>상태</th>
                    <th style={{ width: "15%" }}>작성일</th>
                </tr>
                </thead>
                <tbody>
                {items.length === 0 ? (
                    <tr><td colSpan={4} className={styles.empty}>등록된 문의가 없습니다.</td></tr>
                ) : (
                    items.map((it: any) => {
                        const isPrivate = !!it.isPrivate;
                        const isOwner = myUserId === it.userId;
                        const canOpen = !isPrivate || isOwner || isAdmin;

                const displayNum = totalCount - (page * size) - index;

                return (
                    <tr key={it.supportId}>
                      <td>{displayNum}</td>
                      <td className={styles.titleCell}>
                        {canOpen ? (
                            <Link to={`/support/${it.supportId}`} className={styles.link}>
                              {it.title}
                            </Link>
                        ) : (
                            <span className={styles.locked}>🔒 비공개 문의</span>
                        )}
                      </td>
                      <td>{it.replied ? "답변완료" : "대기중"}</td>
                      <td>{it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                );
              })
          )}
          </tbody>
        </table>

            <div className={styles.paging}>
                <button className={styles.pageBtn} disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                    이전
                </button>
                <span className={styles.pageInfo}>
          {totalPages === 0 ? 1 : page + 1} / {totalPages === 0 ? 1 : totalPages}
        </span>
                <button className={styles.pageBtn} disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default SupportListPage;
