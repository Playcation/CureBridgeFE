// src/api/SupportApi.ts
import axiosInstance from "./Api";
import { SupportRequest } from "../types/support";

const SUPPORT_PUBLIC = "/content/support"; // ✅ 비로그인 허용
const SUPPORT_USER = "/content/support";       // ✅ 로그인 필요

export const fetchSupports = (page = 0, size = 10) =>
    axiosInstance
        .get(`${SUPPORT_PUBLIC}`, { params: { page, size, sort: "id,desc" } })
        .then((res) => res.data);

export const fetchSupportDetail = (supportId: number) =>
    axiosInstance.get(`${SUPPORT_PUBLIC}/${supportId}`).then((res) => res.data);

/** POST (multipart: json + attachedFile[]) */
export const createSupport = (userId: number, data: SupportRequest, files?: File[]) => {
    const formData = new FormData();

    formData.append("json", new Blob([JSON.stringify(data)], { type: "application/json" }));
    (files || []).forEach((file) => formData.append("attachedFile", file));

    return axiosInstance
        .post(`${SUPPORT_USER}?userId=${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
};

export const updateSupport = (supportId: number, data: SupportRequest) =>
    axiosInstance.patch(`${SUPPORT_USER}/${supportId}`, data).then((res) => res.data);

export const deleteSupport = (supportId: number) =>
    axiosInstance.delete(`${SUPPORT_USER}/${supportId}`).then((res) => res.data);

export const searchSupportByTitle = (keyword: string, page = 0, size = 10) =>
    axiosInstance
        .get(`${SUPPORT_PUBLIC}/search-title`, { params: { keyword, page, size, sort: "id,desc" } })
        .then((res) => res.data);

export const searchSupportByAll = (keyword: string, page = 0, size = 10) =>
    axiosInstance
        .get(`${SUPPORT_PUBLIC}/search-all`, { params: { keyword, page, size, sort: "id,desc" } })
        .then((res) => res.data);
