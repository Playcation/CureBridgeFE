import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SupportForm from "../../component/support/SupportForm";
import { createSupport } from "../../api/SupportApi";
import { selectCurrentUserId } from "../../store/slices/authSlice";

function SupportCreatePage() {
    const navigate = useNavigate();
    const userId = useSelector(selectCurrentUserId);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!userId) return alert("로그인이 필요합니다.");
        if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해주세요.");

        setLoading(true);
        try {
            const created = await createSupport(userId, { title, content, isPrivate }, files);
            alert("문의가 등록되었습니다.");
            // created.supportId 로 상세 이동 가능
            navigate(`/support/${created.supportId}`);
        } catch (e) {
            console.error(e);
            alert("문의 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SupportForm
            mode="create"
            title={title}
            content={content}
            isPrivate={isPrivate}
            loading={loading}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onPrivateChange={setIsPrivate}
            onFilesChange={setFiles}
            onSubmit={submit}
            submitText="등록하기"
        />
    );
}

export default SupportCreatePage;