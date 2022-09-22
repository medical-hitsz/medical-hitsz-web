import { useUserStore } from "@/stores/user";
import type { WebSocketInterface, SocketMessage } from "@/types/common";
import type { SocketChatMessage } from "@/types/service";
import { ElMessage } from "element-plus";

enum WebSocketState {
  BeforeConnect = "BeforeConnect",
  HandShaking = "HandShaking",
  Connected = "Connected",
  Disconnected = "Disconnected",
}

class HandledWebSocket extends WebSocket implements WebSocketInterface {
  _state: WebSocketState;
  _messageHandlers: {
    [path: string]: {
      allowedState: WebSocketState[];
      dataHandler: (data: any) => void;
    };
  };
  _messageToSendQueue: {
    message: SocketChatMessage;
    resolve: (value: void) => void;
  }[];
  constructor(messageHandler: (socketChatMessage: SocketChatMessage) => void) {
    super(import.meta.env.VITE_SOCKET_BASE_API + "/api/v1/web-socket/connect");
    this._state = WebSocketState.BeforeConnect;
    this._messageHandlers = {};
    this._messageToSendQueue = [];

    this._addMessageHandler<{ result: string }>(
      [WebSocketState.HandShaking],
      "/server/connect",
      ({ result }) => {
        if (result !== "success") {
          ElMessage.error("服务器身份认证失败！");
          this.disconnect();
        } else {
          this._state = WebSocketState.Connected;
          this._startClearSendQueue();
        }
      }
    );
    this._addMessageHandler<SocketChatMessage>(
      [WebSocketState.Connected],
      "/server/message",
      messageHandler
    );
    this._addMessageHandler<{ result: string }>(
      [WebSocketState.HandShaking, WebSocketState.Connected],
      "/server/disconnect",
      () => {
        this._state = WebSocketState.Disconnected;
        this.close();
      }
    );

    this.onopen = () => {
      this._state = WebSocketState.HandShaking;
      const userStore = useUserStore();
      this._send({
        path: "/client/connect",
        data: { authorization: userStore.authorization },
      });
    };
    this.onmessage = ({ data }) => {
      this._messageHandleController(data);
    };
    this.onerror = (event) => {
      console.log(event);
    };
  }

  _send<T>(socketMessage: SocketMessage<T>) {
    this.send(JSON.stringify(socketMessage));
  }

  _messageHandleController(socketMessage: SocketMessage<any>) {
    const handler = this._messageHandlers[socketMessage.path];
    if (handler?.allowedState.includes(this._state)) {
      handler.dataHandler(socketMessage.data);
    }
  }

  _addMessageHandler<T>(
    allowedState: WebSocketState[],
    path: string,
    dataHandler: (data: T) => void
  ) {
    this._messageHandlers[path] = { allowedState, dataHandler };
  }

  _sendMessage(message: SocketChatMessage) {
    this._send({ path: "/client/message", data: message });
  }

  async sendMessage(message: SocketChatMessage): Promise<void> {
    return new Promise((resolve) => {
      this._startClearSendQueue({ message, resolve });
    });
  }

  _startClearSendQueue(messageContent?: {
    message: SocketChatMessage;
    resolve: (value: void) => void;
  }) {
    if (messageContent) {
      this._messageToSendQueue.push(messageContent);
    }
    if (this._state === WebSocketState.Connected) {
      while (this._messageToSendQueue.length > 0) {
        const item = this._messageToSendQueue.shift();
        if (item) {
          const { message: messageToSend, resolve } = item;
          this._sendMessage(messageToSend);
          resolve();
        }
      }
    }
  }

  disconnect() {
    this._send({ path: "/client/disconnect", data: {} });
  }
}

export const connectWebSocket = (
  messageHandler: (socketChatMessage: SocketChatMessage) => void
) => {
  return new HandledWebSocket(messageHandler);
};
