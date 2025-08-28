import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Report {
  id: string;
  type: string;
  date: string;
  rating: number;
  details: {
    name: string;
    gender: string;
    age: string;
    result: string;
    opinion: string;
  } | null;
}

interface ReportRowProps {
  report: Report;
}

const ReportRow: React.FC<ReportRowProps> = ({ report }) => {
  const [open, setOpen] = useState(false);

  return (
      <>
        <TableRow hover>
          <TableCell padding="checkbox"><Checkbox /></TableCell>
          <TableCell>{report.id}</TableCell>
          <TableCell>{report.type}</TableCell>
          <TableCell>{report.date}</TableCell>
          <TableCell>{'★'.repeat(report.rating)}{'☆'.repeat(5 - report.rating)}</TableCell>
          <TableCell>
            {report.details && (
                <IconButton onClick={() => setOpen(!open)} size="small">
                  <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </IconButton>
            )}
          </TableCell>
        </TableRow>
        {open && report.details && (
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell colSpan={6}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2"><strong>이름</strong>: {report.details.name}</Typography>
                    <Typography variant="body2"><strong>성별</strong>: {report.details.gender}</Typography>
                    <Typography variant="body2"><strong>연령</strong>: {report.details.age}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2"><strong>결과</strong>: {report.details.result}</Typography>
                    <Typography variant="body2"><strong>의견</strong>: {report.details.opinion}</Typography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
        )}
      </>
  );
};

export default ReportRow;
