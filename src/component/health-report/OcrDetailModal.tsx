import React from 'react';
import {
  Modal
} from '@mui/material';

// Note: This interface should ideally be in a separate types file
interface OcrResult {
  reportId: string;
  reportTitle: string;
  patientName: string;
  diagnosis: string;
  reportDate: string;
  createdAt: string;
}

interface OcrDetailModalProps {
  open: boolean;
  onClose: () => void;
  ocrResults: OcrResult[] | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600, // Increased width for more data
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const OcrDetailModal: React.FC<OcrDetailModalProps> = ({ open, onClose, ocrResults }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        backgroundColor: 'background.paper',
        border: '2px solid #000',
        boxShadow: '24px',
        padding: '32px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h2 id="modal-title" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
          세부 OCR 정보
        </h2>
        {ocrResults && ocrResults.length > 0 ? (
          <ul style={{ marginTop: '16px', listStyle: 'none', padding: 0 }}>
            {ocrResults.map((result, index) => (
              <React.Fragment key={result.reportId}>
                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-8px' }}>
                    <div style={{ width: '100%', padding: '8px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 500 }}>
                            결과 #{index + 1}
                        </div>
                    </div>
                    <div style={{ width: '33.33%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}><strong>환자 이름:</strong></span></div>
                    <div style={{ width: '66.66%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}>{result.patientName}</span></div>
                    <div style={{ width: '33.33%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}><strong>진단명:</strong></span></div>
                    <div style={{ width: '66.66%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}>{result.diagnosis}</span></div>
                    <div style={{ width: '33.33%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}><strong>보고서 제목:</strong></span></div>
                    <div style={{ width: '66.66%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}>{result.reportTitle}</span></div>
                    <div style={{ width: '33.33%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}><strong>보고서 날짜:</strong></span></div>
                    <div style={{ width: '66.66%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}>{result.reportDate}</span></div>
                     <div style={{ width: '33.33%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}><strong>생성일:</strong></span></div>
                    <div style={{ width: '66.66%', padding: '8px' }}><span style={{ fontSize: '0.875rem' }}>{result.createdAt}</span></div>
                  </div>
                </li>
                {index < ocrResults.length - 1 && <hr style={{ margin: '0 16px' }} />}
              </React.Fragment>
            ))}
          </ul>
        ) : (
          <p id="modal-description" style={{ marginTop: '16px' }}>
            세부 정보가 없습니다.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default OcrDetailModal;
