export interface ScheduleResponseDto {
  id: number;
  date: string;
  title: string;
  content: string;
}

export interface CreateScheduleRequestDto {
  date: string;
  title: string;
  content: string;
}

export interface FindScheduleRequestDto {
  date: string;
}

// Ocr
export interface OcrResult {
  reportId: string;
  reportTitle: string;
  patientName: string;
  diagnosis: string;
  reportDate: string;
  createdAt: string;
}

export interface OcrDetailModalProps {
  open: boolean;
  onClose: () => void;
  ocrResults: OcrResult[] | null;
}