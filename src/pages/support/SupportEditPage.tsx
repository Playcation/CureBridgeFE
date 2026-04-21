// src/pages/support/SupportEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./SupportEditPage.module.css";
import { fetchSupportDetail, updateSupport } from "../../api/SupportApi";
import { selectCurrentUserId } from "../../store/slices/authSlice";

function SupportEditPage() {
    const { supportId } = useParams<{ supportId: string }>();
    const navigate = useNavigate();
    const myUserId = useSelector(selectCurrentUserId);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            if (!supportId) return;
            setLoading(true);
            try {
                const detail = await fetchSupportDetail(Number(supportId));

                if (!myUserId) {
                    alert("로그인 후 수정할 수 있어요.");
                    navigate("/support");
                    return;
                }

                if (detail.userId !== myUserId) {
                    alert("본인 문의만 수정할 수 있어요.");
                    navigate("/support");
                    return;
                }

                if (detail.isReplied) {
                    alert("답변이 등록된 문의는 수정할 수 없어요.");
                    navigate(`/support/${supportId}`);
                    return;
                }

                setTitle(detail.title || "");
                setContent(detail.content || "");
                setIsPrivate(!!detail.isPrivate);
            } catch (e) {
                console.error(e);
                alert("정보를 불러오지 못했습니다.");
                navigate("/support");
            } finally {
                setLoading(false);
            }
        })();
    }, [supportId, myUserId, navigate]);
        setIsPrivate(detail.private);

    const onSubmit = async () => {
        if (!supportId) return;
        if (!title.trim() || !content.trim()) return alert("제목/내용을 입력해주세요.");

        setSubmitting(true);
        try {
            await updateSupport(Number(supportId), { title, content, isPrivate, });
            alert("수정되었습니다.");
            navigate(`/support/${supportId}`);
        } catch (e) {
            console.error(e);
            alert("수정에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className={styles.status}>불러오는 중...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>문의 수정</h2>
                <button className={styles.outline} onClick={() => navigate(`/support/${supportId}`)}>취소</button>
            </div>

            <div className={styles.field}>
                <div className={styles.label}>제목</div>
                <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className={styles.field}>
                <div className={styles.label}>내용</div>
                <textarea className={styles.textarea} value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            <div className={styles.row}>
                <label className={styles.checkbox}>
                    <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                    비공개
                </label>
            </div>

            <div className={styles.actions}>
                <button className={styles.primary} disabled={submitting} onClick={onSubmit}>
                    {submitting ? "수정 중..." : "수정"}
                </button>
            </div>
        </div>
    );
}

export default SupportEditPage;
