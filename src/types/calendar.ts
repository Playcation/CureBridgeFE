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