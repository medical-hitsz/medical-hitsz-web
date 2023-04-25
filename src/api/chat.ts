import type { ApiResponsePromise } from "@/types/common";
import type { ChatRoom, Message } from "@/types/service";
import { get, post } from "@/api/http";

const apiGroup = "/api/v1/chat";

export default {
  createRoom(params: {
    roomName: string;
    modelId: string;
  }): ApiResponsePromise<{ roomID: string }> {
    return post(apiGroup + "/create-room", params);
  },
  getRoomList(): ApiResponsePromise<ChatRoom[]> {
    return get(apiGroup + "/get-room-list");
  },
  getMsgList(params: { id: string }): ApiResponsePromise<Message[]> {
    return get(apiGroup + "/get-msg-list", params);
  },
  deleteRoom(params: { roomID: string }): ApiResponsePromise<null> {
    return post(apiGroup + "/delete-room", params);
  },
};
