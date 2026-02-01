// src/pages/support/SupportCreatePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./SupportCreatePage.module.css";
import { createSupport } from "../../api/SupportApi";
import { selectCurrentUserId } from "../../store/slices/authSlice";

function SupportCreatePage() {
    const navigate = useNavigate();
    const myUserId = useSelector(selectCurrentUserId);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        if (!myUserId) return alert("로그인 후 작성할 수 있어요.");
        if (!title.trim() || !content.trim()) return alert("제목/내용을 입력해주세요.");

        setSubmitting(true);
        try {
            await createSupport(myUserId, { title, content, isPrivate,}, files);
            alert("등록되었습니다.");
            navigate("/support");
        } catch (e) {
            console.error(e);
            alert("등록에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>문의 작성</h2>
                <button className={styles.outline} onClick={() => navigate("/support")}>목록</button>
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

            <div className={styles.field}>
                <div className={styles.label}>첨부파일</div>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
            </div>

            <div className={styles.actions}>
                <button className={styles.primary} disabled={submitting} onClick={onSubmit}>
                    {submitting ? "등록 중..." : "등록"}
                </button>
            </div>
        </div>
    );
}

export default SupportCreatePage;
