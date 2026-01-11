import React, { useState } from 'react';
import {inviteUser} from "../../api/Api";

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNameChecked, setIsNameChecked] = useState(false);

  if (!open) return null;

  // 1. 이메일 조회 함수
  const handleCheckEmail = async () => {
    if (!email) return alert("이메일을 입력해주세요.");
    // 여기에 API 호출 로직 추가 (예: checkEmailApi(email))
    console.log(`${email} 조회 중...`);
    setIsEmailChecked(true);
  };

  // 2. 이름 조회 함수
  const handleCheckName = async () => {
    if (!name) return alert("성함을 입력해주세요.");
    console.log(`${name} 조회 중...`);
    setIsNameChecked(true);
  };

  // 3. 최종 연결하기 (초대하기) 함수
  const handleInvite = async () => {
    // if (!isEmailChecked || !isNameChecked) {
    //   return alert("이메일과 성함 조회를 먼저 완료해주세요.");
    // }

    const inviteData = { email, name };
    console.log("초대 데이터 전송:", inviteData);

    // API 통신 예시:
    // const response = await invitePatient(inviteData);
    // if (response.ok) { ... }

    const response = await inviteUser(inviteData)
    console.log(response)

    alert(`${name}님에게 초대 요청을 보냈습니다.`);
    onClose(); // 성공 시 모달 닫기
  };

  return (
      <div style={overlayStyle}>
        <div style={modalContainerStyle}>
          {/* 헤더 */}
          <div style={headerStyle}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>환자 초대</h2>
            <button onClick={onClose} style={closeButtonStyle}>&times;</button>
          </div>

          {/* 이메일 입력 섹션 */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>환자 이메일 (아이디)</label>
            <div style={rowStyle}>
              <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setIsEmailChecked(false); }}
                  placeholder="환자 이메일을 입력해주세요."
                  style={inputStyle}
              />
              {/*<button onClick={handleCheckEmail} style={smallButtonStyle}>조회하기</button>*/}
            </div>
            {/*{isEmailChecked && <p style={successMsgStyle}>정상적으로 조회되었습니다.</p>}*/}
          </div>

          {/* 이름 입력 섹션 */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>환자 성함</label>
            <div style={rowStyle}>
              <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setIsNameChecked(false); }}
                  placeholder="환자 성함을 입력해주세요."
                  style={inputStyle}
              />
              {/*<button onClick={handleCheckName} style={smallButtonStyle}>조회하기</button>*/}
            </div>
            {/*{isNameChecked && <p style={successMsgStyle}>정상적으로 조회되었습니다.</p>}*/}
          </div>

          {/* 연결하기 버튼 */}
          <button onClick={handleInvite} style={mainButtonStyle}>
            연결하기
          </button>
        </div>
      </div>
  );
};

// --- 스타일 객체 (MUI 없이 순수 CSS 처리) ---

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  width: '450px',
  padding: '32px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '0.875rem',
  color: '#374151',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
};

const smallButtonStyle: React.CSSProperties = {
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  padding: '0 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const mainButtonStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  padding: '14px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
};

const successMsgStyle: React.CSSProperties = {
  color: '#6366f1',
  fontSize: '0.75rem',
  marginTop: '4px',
  marginRight: 'auto',
};

export default InviteModal;