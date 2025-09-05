import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Typography,
  Box,
  Collapse,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OcrDetailModal from './OcrDetailModal'; // Import the new modal component

// This interface should ideally be in a separate types file
interface OcrResult {
  reportId: string;
  reportTitle: string;
  patientName: string;
  diagnosis: string;
  reportDate: string;
  createdAt: string;
}

interface Report {
  id: string;
  title: string;
  count: number;
  reportDate: string;
  ocrResults: OcrResult[] | null;
  summery: string;
  rate: number;
}


interface ReportRowProps {
  report: Report;
}

const ReportRow: React.FC<ReportRowProps> = ({ report }) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
      <>
        <TableRow hover>
          <TableCell padding="checkbox"><Checkbox /></TableCell>
          <TableCell>{report.id}</TableCell>
          {/* Changed from type to title */}
          <TableCell>{report.title}</TableCell>
          {/* Changed from date to reportDate */}
          <TableCell>{report.reportDate}</TableCell>
          {/* Changed from rating to rate */}
          <TableCell>{'★'.repeat(report.rate)}{'☆'.repeat(5 - report.rate)}</TableCell>
          <TableCell>
            {report.summery && (
                <IconButton onClick={() => setOpen(!open)} size="small">
                  <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </IconButton>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, p: 2, backgroundColor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" gutterBottom component="div">
                    요약 정보
                  </Typography>
                  {/* Check for ocrResults now */}
                  {report.ocrResults && report.ocrResults.length > 0 && (
                    <Button variant="outlined" size="small" onClick={handleModalOpen}>
                      더보기
                    </Button>
                  )}
                </Box>
                <Typography variant="body2">{report.summery}</Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>

        {/* Use the new OcrDetailModal component */}
        <OcrDetailModal
          open={modalOpen}
          onClose={handleModalClose}
          ocrResults={report.ocrResults}
        />
      </>
  );
};

export default ReportRow;
