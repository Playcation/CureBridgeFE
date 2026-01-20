import axiosInstance from "./Api";

export const getOcrByUserId = async (id: number) => {
  return await axiosInstance.get(`/api/user/ocr/user/${id}`);
};

export const getHealthReportById = async (reportId: string) => {
  return await axiosInstance.get(`/api/user/ocr/${reportId}`);
};

export const uploadOcrImage = async (userId: number, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(`/api/user/ocr/upload/user/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createHealthReport = async (report: any): Promise<any> => {
  const response = await axiosInstance.post('/api/user/ocr', report);
  return response.data;
};

export const updateHealthReport = async (reportId: number, report: any): Promise<any> => {
  const response = await axiosInstance.put(`/api/user/ocr/${reportId}`, report);
  return response.data;
};