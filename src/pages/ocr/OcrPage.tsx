import { getHealthReportById, uploadOcrImage, createHealthReport, updateHealthReport, getOcrByUserId } from '../../api/ocrApi';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, TextField, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../store/slices/authSlice';

const OcrPage = () => {
    const { reportId } = useParams<{ reportId: string }>();
    const userId = useSelector(selectCurrentUserId);
    const navigate = useNavigate();

    const [history, setHistory] = useState<any[]>([]); // OCR 전체 내역
    const [report, setReport] = useState<any>(null); // 상세/분석 결과
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false); // 업로드 모드 전환

    // 1. 초기 데이터 로드: 목록 또는 상세
    useEffect(() => {
        if (reportId) {
            fetchDetail(reportId);
        } else {
            fetchHistory();
            setReport(null);
            setIsUploading(false);
        }
    }, [reportId, userId]);

    // 전체 내역 조회
    const fetchHistory = async () => {
        if (!userId) return;
        try {
            const response = await getOcrByUserId(userId);
            if (response && response.data) setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    // 상세 조회
    const fetchDetail = async (id: string) => {
        try {
            const response = await getHealthReportById(id);
            if (response && response.data) setReport(response.data);
        } catch (error) {
            console.error("Failed to fetch detail:", error);
        }
    };

    // 2. OCR 업로드 로직
    const handleUpload = async () => {
        if (!selectedFile || !userId) return;
        try {
            const response = await uploadOcrImage(userId, selectedFile);
            if (response) {
                setReport(response);
                setIsEditing(true);
                setIsUploading(false);
            }
        } catch (error) {
            alert("이미지 분석에 실패했습니다.");
        }
    };

    // 3. 저장 로직
    const handleSave = async () => {
        if (!report || userId === null) return;
        try {
            let savedReport;
            const reportWithUserId = { ...report, userId: userId };
            if (report.reportId || report.id) {
                savedReport = await updateHealthReport(report.reportId || report.id, reportWithUserId);
            } else {
                savedReport = await createHealthReport(reportWithUserId);
            }
            if (savedReport) {
                setReport(savedReport);
                setIsEditing(false);
                navigate(`/ocr/${savedReport.reportId || savedReport.id}`);
            }
        } catch (error) {
            console.error("Failed to save:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReport({ ...report, [name]: value });
    };

    // --- 화면 분기 처리 ---

    // A. 업로드 화면 모드
    if (isUploading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>새 진단서 등록 (OCR)</Typography>
                    <Box sx={{ my: 3, p: 4, border: '2px dashed #ccc', textAlign: 'center' }}>
                        <input type="file" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} accept="image/*" />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" onClick={handleUpload} disabled={!selectedFile}>분석 시작</Button>
                        <Button variant="outlined" onClick={() => setIsUploading(false)}>취소</Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    // B. 상세 조회 및 수정 화면
    if (reportId || report) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>분석 결과 확인</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><TextField label="제목" name="reportTitle" value={report?.reportTitle || ''} onChange={handleChange} fullWidth disabled={!isEditing} /></Grid>
                        <Grid item xs={6}><TextField label="환자명" name="patientName" value={report?.patientName || ''} onChange={handleChange} fullWidth disabled={!isEditing} /></Grid>
                        <Grid item xs={6}><TextField label="진단일" name="reportDate" type="date" value={report?.reportDate || ''} onChange={handleChange} fullWidth disabled={!isEditing} InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid item xs={12}><TextField label="병명/진단" name="diagnosis" value={report?.diagnosis || ''} onChange={handleChange} fullWidth multiline rows={4} disabled={!isEditing} /></Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        {isEditing ? <Button variant="contained" onClick={handleSave}>저장</Button> : <Button variant="contained" color="secondary" onClick={() => setIsEditing(true)}>수정</Button>}
                        <Button variant="outlined" onClick={() => navigate('/ocr')}>목록으로</Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    // C. 메인: OCR 전체 내역 목록 화면
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">나의 OCR 등록 내역</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsUploading(true)}>새 문서 등록</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>진단일</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell>환자명</TableCell>
                            <TableCell align="center">상세보기</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.length > 0 ? history.map((row) => (
                            <TableRow key={row.reportId || row.id} hover onClick={() => navigate(`/ocr/${row.reportId || row.id}`)} sx={{ cursor: 'pointer' }}>
                                <TableCell>{row.reportDate || '-'}</TableCell>
                                <TableCell>{row.reportTitle || '제목 없음'}</TableCell>
                                <TableCell>{row.patientName || '-'}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small"><ViewIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>등록된 내역이 없습니다. 새 문서를 등록해 주세요.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default OcrPage;