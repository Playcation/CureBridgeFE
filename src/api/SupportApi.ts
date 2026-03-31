// src/api/SupportApi.ts
import axiosInstance from "./Api";
import {SupportRequest} from "../types/support";

//const SUPPORT_PUBLIC = "/api/anonymous/support"; // ✅ 비로그인 허용
//const SUPPORT_USER = "/api/user/support";       // ✅ 로그인 필요
const API_BASE_URL = '/content/support';

export const fetchSupports = (page = 0, size = 10) =>
    axiosInstance
    .get(`${API_BASE_URL}`, {params: {page, size, sort: "id,desc"}})
    .then((res) => res.data);

export const fetchSupportDetail = (supportId: number) =>
    axiosInstance.get(`${API_BASE_URL}/${supportId}`).then((res) => res.data);

/** POST (multipart: json + attachedFile[]) */
export const createSupport = (userId: number, data: SupportRequest, files?: File[]) => {
  const formData = new FormData();

  formData.append("json", new Blob([JSON.stringify(data)], {type: "application/json"}));
  (files || []).forEach((file) => formData.append("attachedFile", file));

  return axiosInstance
  .post(`${API_BASE_URL}?userId=${userId}`, formData, {
    headers: {"Content-Type": "multipart/form-data"},
  })
  .then((res) => res.data);
};

export const updateSupport = (supportId: number, data: SupportRequest) =>
    axiosInstance.patch(`${API_BASE_URL}/${supportId}`, data).then((res) => res.data);

export const deleteSupport = (supportId: number) =>
    axiosInstance.delete(`${API_BASE_URL}/${supportId}`).then((res) => res.data);

export const searchSupportByTitle = (keyword: string, page = 0, size = 10) =>
    axiosInstance
    .get(`${API_BASE_URL}/search-title`, {params: {keyword, page, size, sort: "id,desc"}})
    .then((res) => res.data);

export const searchSupportByAll = (keyword: string, page = 0, size = 10) =>
    axiosInstance
    .get(`${API_BASE_URL}/search-all`, {params: {keyword, page, size, sort: "id,desc"}})
    .then((res) => res.data);
