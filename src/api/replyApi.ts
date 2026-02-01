import axiosInstance from "./Api";
import { ReplyRequest } from "../types/support";

/** ADMIN 토큰 필요: ReplyController에서 jwtParser.checkAdmin */
export const createReply = (data: ReplyRequest) =>
    axiosInstance.post("/api/reply", data).then((res) => res.data);

export const updateReply = (data: ReplyRequest) =>
    axiosInstance.patch("/api/reply", data).then((res) => res.data);

export const deleteReply = (supportId: number) =>
    axiosInstance.delete(`/api/reply/${supportId}`).then((res) => res.data);
