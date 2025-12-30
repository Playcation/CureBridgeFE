import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchSupportDetail, deleteSupport } from "../../api/SupportApi";
import { SupportDetail } from "../../types/support";
import { selectCurrentUserId, selectIsAdmin } from "../../store/slices/authSlice";
import ReplyBox from "../../component/support/ReplyBox";
import styles from "./SupportDetailPage.module.css";

function SupportDetailPage() {
    const { supportId } = useParams<{ supportId: string }>();
    const navigate = useNavigate();

    const myUserId = useSelector(selectCurrentUserId);
    const isAdmin = useSelector(selectIsAdmin);

    const [data, setData] = useState<SupportDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!supportId) return;
        setLoading(true);
        try {
            const detail = await fetchSupportDetail(Number(supportId));

            // 비공개 글 접근 제한(작성자 or ADMIN만)
            if (detail.isPrivate && !isAdmin && myUserId !== detail.userId) {
                alert("비공개 문의입니다.");
                navigate("/support");
                return;
            }

            setData(detail);
        } catch (e) {
            console.error(e);
            alert("문의 정보를 불러오지 못했습니다.");
            navigate("/support");
        } finally {
            setLoading(false);
        }
    }, [supportId, isAdmin, myUserId, navigate]);

    useEffect(() => {
        load();
    }, [load]);

    const onDelete = async () => {
        if (!data) return;

        if (data.isReplied) {
            return alert("답변이 등록된 문의는 삭제할 수 없습니다.");
        }
        if (myUserId !== data.userId) {
            return alert("본인 문의만 삭제할 수 있습니다.");
        }
        if (!window.confirm("정말 삭제할까요?")) return;

        try {
            await deleteSupport(data.id);
            alert("삭제되었습니다.");
            navigate("/support");
        } catch (e) {
            console.error(e);
            alert("삭제에 실패했습니다.");
        }
    };

    if (loading) return <div className={styles.status}>불러오는 중...</div>;
    if (!data) return <div className={styles.status}>데이터가 없습니다.</div>;

    const canEditOrDelete = myUserId === data.userId && !data.isReplied;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>문의하기</h2>
                <div className={styles.headerRight}>
                    <button className={styles.outline} onClick={() => navigate("/support")}>
                        목록
                    </button>
                    {canEditOrDelete && (
                        <>
                            <button
                                className={styles.outline}
                                onClick={() => navigate(`/support/edit/${data.id}`)}
                            >
                                수정
                            </button>
                            <button className={styles.danger} onClick={onDelete}>
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.sectionLine} />

            <div className={styles.metaRow}>
                <div>작성자: <b>{data.userId}</b></div>
                <div>조회수: <b>{data.viewCount}</b></div>
                <div>{data.isPrivate ? "비공개" : "공개"}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.label}>제목</div>
                <div className={styles.value}>{data.title}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.label}>문의내용</div>
                <div className={styles.contentBox}>{data.content}</div>
            </div>

            <div className={styles.field}>
                <div className={styles.label}>첨부파일</div>
                <div className={styles.files}>
                    {data.attachedFilePaths?.length ? (
                        data.attachedFilePaths.map((p, idx) => (
                            <a key={idx} href={p} target="_blank" rel="noreferrer" className={styles.fileLink}>
                                {p}
                            </a>
                        ))
                    ) : (
                        <span className={styles.empty}>첨부파일 없음</span>
                    )}
                </div>
            </div>

            <ReplyBox
                supportId={data.id}
                isReplied={data.isReplied}
                replyContent={data.replyContent}
                repliedAt={data.repliedAt}
                editable={isAdmin}
                onChanged={load}
            />
        </div>
    );
}

export default SupportDetailPage;
