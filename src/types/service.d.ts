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
  isAdmin?: boolean;
}

export declare interface ChatRoom {
  roomID: string;
  roomName: string;
  lastMsgTime: timeMs;
  modelName?: string;
  modelId?: number;
}

export declare interface Message {
  msgID: number;
  msg: string;
  isUser: boolean;
  createTime: timeMs;
  roomID?: string;
  clientMsgID?: string;
}

export declare interface MessageToSend {
  msg: string;
  roomID: string;
  clientMsgID: string;
}

export declare interface Model {
  modelId: number;
  modelName: string;
  runningStatus?: string;
  ownerName?: string;
  modelSecret?: string;
}
