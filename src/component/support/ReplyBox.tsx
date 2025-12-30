import React, { useEffect, useState } from "react";
import styles from "./ReplyBox.module.css";
import { createReply, updateReply, deleteReply } from "../../api/replyApi";

type Props = {
    supportId: number;
    isReplied: boolean;
    replyContent?: string | null;
    repliedAt?: string | null;

    /** 관리자만 true로 */
    editable?: boolean;

    /** 저장/삭제 후 상세 재조회 트리거 */
    onChanged?: () => void;
};

function ReplyBox({
                      supportId,
                      isReplied,
                      replyContent,
                      repliedAt,
                      editable,
                      onChanged,
                  }: Props) {
    const [text, setText] = useState(replyContent || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setText(replyContent || "");
    }, [replyContent]);

    const save = async () => {
        if (!editable) return;
        if (!text.trim()) return alert("답글 내용을 입력해주세요.");

        setLoading(true);
        try {
            if (isReplied) {
                await updateReply({ supportId, replyContent: text });
                alert("답글이 수정되었습니다.");
            } else {
                await createReply({ supportId, replyContent: text });
                alert("답글이 등록되었습니다.");
            }
            onChanged?.();
        } catch (e) {
            console.error(e);
            alert("답글 처리에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const remove = async () => {
        if (!editable) return;
        if (!window.confirm("답글을 삭제할까요?")) return;

        setLoading(true);
        try {
            await deleteReply(supportId);
            alert("답글이 삭제되었습니다.");
            onChanged?.();
        } catch (e) {
            console.error(e);
            alert("답글 삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.titleRow}>
                <div className={styles.title}>답변</div>
                {repliedAt && <div className={styles.date}>{new Date(repliedAt).toLocaleString()}</div>}
            </div>

            {editable ? (
                <>
          <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="관리자 답글을 입력해주세요."
              disabled={loading}
          />
                    <div className={styles.actions}>
                        <button className={styles.primary} onClick={save} disabled={loading}>
                            {loading ? "처리 중..." : isReplied ? "답글 수정" : "답글 등록"}
                        </button>
                        {isReplied && (
                            <button className={styles.danger} onClick={remove} disabled={loading}>
                                삭제
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.readonlyBox}>
                    {isReplied ? (replyContent || "") : "아직 답변이 등록되지 않았습니다."}
                </div>
            )}
        </div>
    );
}

export default ReplyBox;
