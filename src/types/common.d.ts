export type ApiResponsePromise<T = any> = Promise<ApiResponse<T>>;

export declare interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export declare interface SocketMessage<T> {
  path: string;
  data: T;
}

export declare interface WebSocketInterface {
  sendMessage: (message: SocketChatMessage) => Promise<void>;
  disconnect: () => void;
}
