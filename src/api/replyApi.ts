import axiosInstance from "./Api";
import {ReplyRequest} from "../types/support";

const API_BASE_URL = '/content/reply';

/** ADMIN 토큰 필요: ReplyController에서 jwtParser.checkAdmin */
export const createReply = (data: ReplyRequest) =>
    axiosInstance.post(API_BASE_URL, data).then((res) => res.data);

export const updateReply = (data: ReplyRequest) =>
    axiosInstance.patch(API_BASE_URL, data).then((res) => res.data);

export const deleteReply = (supportId: number) =>
    axiosInstance.delete(`${API_BASE_URL}/${supportId}`).then((res) => res.data);
