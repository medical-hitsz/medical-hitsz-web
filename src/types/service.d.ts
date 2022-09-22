export type timeMs = number;

export declare interface CosSecret {
  credentials: {
    TmpSecretId: string;
    TmpSecretKey: string;
    Token: string;
  };
  startTime: number;
  expiredTime: number;
}

export declare interface CosConfig {
  directory: string;
  bucket: string;
  region: string;
}

export declare interface User {
  nickname: string;
  avatar: string;
}

export declare interface ChatRoom {
  roomID: string;
  roomName: string;
  lastMsgTime: timeMs;
}

export declare interface Message {
  msgID: number;
  msg: string;
  isUser: boolean;
  createTime: timeMs;
}

export declare interface SocketChatMessage {
  roomID: string;
  message: string;
}
