import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SupportForm from "../../component/support/SupportForm";
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

    useEffect(() => {
        const load = async () => {
            if (!supportId) return;
            setLoading(true);
            try {
                const detail = await fetchSupportDetail(Number(supportId));
                if (detail.isReplied) {
                    alert("답변이 등록된 문의는 수정할 수 없습니다.");
                    navigate(`/support/${supportId}`);
                    return;
                }
                if (myUserId !== detail.userId) {
                    alert("본인 문의만 수정할 수 있습니다.");
                    navigate(`/support/${supportId}`);
                    return;
                }

                setTitle(detail.title);
                setContent(detail.content);
                setIsPrivate(detail.isPrivate);
            } catch (e) {
                console.error(e);
                alert("문의 정보를 불러오지 못했습니다.");
                navigate("/support");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [supportId, myUserId, navigate]);

    const submit = async () => {
        if (!supportId) return;
        if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해주세요.");

        setLoading(true);
        try {
            await updateSupport(Number(supportId), { title, content, isPrivate });
            alert("수정되었습니다.");
            navigate(`/support/${supportId}`);
        } catch (e) {
            console.error(e);
            alert("수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SupportForm
            mode="edit"
            title={title}
            content={content}
            isPrivate={isPrivate}
            loading={loading}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onPrivateChange={setIsPrivate}
            onSubmit={submit}
            submitText="수정하기"
        />
    );
}

export default SupportEditPage;
