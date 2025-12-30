import axiosInstance from "./Api";
import { SupportRequest } from "../types/support";

/** PagingDto<T>가 content/totalElements 형태일 가능성이 높아서 그 기준으로 사용 */
export const fetchSupports = (page = 0, size = 10) =>
    axiosInstance
        .get("/support", { params: { page, size, sort: "id,desc" } })
        .then((res) => res.data);

export const fetchSupportDetail = (supportId: number) =>
    axiosInstance.get(`/support/${supportId}`).then((res) => res.data);

/** POST /support?userId=...  (multipart: json + attachedFile[]) */
export const createSupport = (
    userId: number,
    data: SupportRequest,
    files?: File[]
) => {
    const formData = new FormData();

    formData.append(
        "json",
        new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    (files || []).forEach((file) => formData.append("attachedFile", file));

    return axiosInstance
        .post(`/support?userId=${userId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
};

export const updateSupport = (supportId: number, data: SupportRequest) =>
    axiosInstance.patch(`/support/${supportId}`, data).then((res) => res.data);

export const deleteSupport = (supportId: number) =>
    axiosInstance.delete(`/support/${supportId}`).then((res) => res.data);

/** 검색 */
export const searchSupportByTitle = (keyword: string, page = 0, size = 10) =>
    axiosInstance
        .get("/support/search-title", { params: { keyword, page, size, sort: "id,desc" } })
        .then((res) => res.data);

export const searchSupportByAll = (keyword: string, page = 0, size = 10) =>
    axiosInstance
        .get("/support/search-all", { params: { keyword, page, size, sort: "id,desc" } })
        .then((res) => res.data);
