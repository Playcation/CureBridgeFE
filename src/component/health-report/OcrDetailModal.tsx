import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  Divider
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
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          세부 OCR 정보
        </Typography>
        {ocrResults && ocrResults.length > 0 ? (
          <List sx={{ mt: 2 }}>
            {ocrResults.map((result, index) => (
              <React.Fragment key={result.reportId}>
                <ListItem alignItems="flex-start">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="div">
                            결과 #{index + 1}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}><Typography variant="body2"><strong>환자 이름:</strong></Typography></Grid>
                    <Grid item xs={8}><Typography variant="body2">{result.patientName}</Typography></Grid>
                    <Grid item xs={4}><Typography variant="body2"><strong>진단명:</strong></Typography></Grid>
                    <Grid item xs={8}><Typography variant="body2">{result.diagnosis}</Typography></Grid>
                    <Grid item xs={4}><Typography variant="body2"><strong>보고서 제목:</strong></Typography></Grid>
                    <Grid item xs={8}><Typography variant="body2">{result.reportTitle}</Typography></Grid>
                    <Grid item xs={4}><Typography variant="body2"><strong>보고서 날짜:</strong></Typography></Grid>
                    <Grid item xs={8}><Typography variant="body2">{result.reportDate}</Typography></Grid>
                     <Grid item xs={4}><Typography variant="body2"><strong>생성일:</strong></Typography></Grid>
                    <Grid item xs={8}><Typography variant="body2">{result.createdAt}</Typography></Grid>
                  </Grid>
                </ListItem>
                {index < ocrResults.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography id="modal-description" sx={{ mt: 2 }}>
            세부 정보가 없습니다.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default OcrDetailModal;
