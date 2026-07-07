import React, { useMemo } from "react";
import styles from "./SupportForm.module.css";

type Props = {
    mode: "create" | "edit";
    title: string;
    content: string;
    isPrivate: boolean;
    loading?: boolean;

    onTitleChange: (v: string) => void;
    onContentChange: (v: string) => void;
    onPrivateChange: (v: boolean) => void;

    /** 작성(create)에서만 사용(파일 업로드). 수정은 백엔드가 파일 수정 없음 */
    onFilesChange?: (files: File[]) => void;

    onSubmit: () => void;
    submitText?: string;
};

function SupportForm({
                         mode,
                         title,
                         content,
                         isPrivate,
                         loading,
                         onTitleChange,
                         onContentChange,
                         onPrivateChange,
                         onFilesChange,
                         onSubmit,
                         submitText,
                     }: Props) {
    const submitLabel = useMemo(() => {
        if (submitText) return submitText;
        return mode === "create" ? "등록하기" : "수정하기";
    }, [mode, submitText]);

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.pageTitle}>문의하기</h2>
            </div>

            <div className={styles.sectionLine} />

        <div className={styles.formGrid}>
          {/* 공개여부 */}
          <div className={styles.row}>
            <div className={styles.label}>공개 여부</div>
            <div className={styles.value}>
              <label className={styles.checkboxLabel}>
                <input
                    type="radio"
                    name="privacy"
                    checked={isPrivate === false}
                    onChange={() => onPrivateChange(false)}
                    disabled={!!loading}
                />
                공개
              </label>

              <label className={styles.checkboxLabel}>
                <input
                    type="radio"
                    name="privacy"
                    checked={isPrivate === true}
                    onChange={(e) => onPrivateChange(true)}
                    disabled={!!loading}
                />
                비공개
              </label>
            </div>
          </div>

                {/* 제목 */}
                <div className={styles.row}>
                    <div className={styles.label}>제목</div>
                    <div className={styles.value}>
                        <input
                            className={styles.input}
                            placeholder="제목을 입력해주세요. (최대 100자)"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            disabled={!!loading}
                            maxLength={100}
                        />
                    </div>
                </div>

                {/* 문의내용 */}
                <div className={styles.row}>
                    <div className={styles.label}>문의내용</div>
                    <div className={styles.value}>
            <textarea
                className={styles.textarea}
                placeholder="문의 내용을 입력해주세요."
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                disabled={!!loading}
            />
                        <p className={styles.helpText}>
                            문의 내용과 관련된 파일만 첨부해주세요. (개인정보 접수 불가)
                            <br />
                            동영상은 zip파일로 첨부하거나 업로드한 동영상 사이트 URL을 기재해주세요.
                        </p>
                    </div>
                </div>

                {/* 파일 업로드 (create에서만) */}
                {mode === "create" && onFilesChange && (
                    <div className={styles.row}>
                        <div className={styles.label}>파일 첨부</div>
                        <div className={styles.value}>
                            <input
                                type="file"
                                multiple
                                className={styles.fileInput}
                                onChange={(e) => onFilesChange(Array.from(e.target.files || []))}
                                disabled={!!loading}
                            />
                            <div className={styles.fileHint}>(여러 개 가능)</div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.submitButton}
                    onClick={onSubmit}
                    disabled={!!loading}
                >
                    {loading ? "처리 중..." : submitLabel}
                </button>
            </div>
        </div>
    );
}

export default SupportForm;
