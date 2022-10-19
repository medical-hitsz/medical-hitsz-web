import { useUserStore } from "@/stores/user";
import type { WebSocketInterface, SocketMessage } from "@/types/common";
import type { SocketChatMessage } from "@/types/service";
import { ElMessage } from "element-plus";

class Timer {
  timeToWait: number;
  timeout: NodeJS.Timeout | null;
  callback: () => void;
  constructor(callback: () => void, timeToWait = 5000) {
    this.timeToWait = timeToWait;
    this.timeout = null;
    this.callback = callback;
  }
  start() {
    this.stop();
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.callback();
    }, this.timeToWait);
  }
  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

enum HeartBeatState {
  WaitingForSending = "WaitingForSending",
  WaitingForReceiving = "WaitingForReceiving",
  Closed = "Closed",
}

class HeartBeatHandler {
  state: HeartBeatState;
  sendTimer: Timer;
  receiveTimer: Timer;
  constructor(heartBeatFunc: () => void, closeFunc: () => void) {
    this.state = HeartBeatState.WaitingForSending;
    this.sendTimer = new Timer(() => {
      this.state = HeartBeatState.WaitingForReceiving;
      this.receiveTimer.start();
      heartBeatFunc();
    });
    this.receiveTimer = new Timer(() => {
      this.close();
      closeFunc();
    });
    this.sendTimer.start();
  }
  restart() {
    if (this.state !== HeartBeatState.Closed) {
      this.state = HeartBeatState.WaitingForSending;
      this.receiveTimer.stop();
      this.sendTimer.start();
    }
  }
  close() {
    if (this.state !== HeartBeatState.Closed) {
      this.state = HeartBeatState.Closed;
      this.receiveTimer.stop();
      this.sendTimer.stop();
    }
  }
}

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
  _heartBeatHandler: HeartBeatHandler | null;
  constructor(messageHandler: (socketChatMessage: SocketChatMessage) => void) {
    super(import.meta.env.VITE_SOCKET_BASE_API + "/websocket/v1/connect");
    this._state = WebSocketState.BeforeConnect;
    this._messageHandlers = {};
    this._messageToSendQueue = [];
    this._heartBeatHandler = null;

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
          this._heartBeatHandler = new HeartBeatHandler(() => {
            this._send({
              path: "/client/heart-beat",
              data: null,
            });
          }, this._close);
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
      this._close
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
      this._heartBeatRestart();
      this._messageHandleController(JSON.parse(data as string));
    };
    this.onerror = () => {};
    this.onclose = () => {
      this._heartBeatClose();
    };
  }

  _send<T>(socketMessage: SocketMessage<T>) {
    this.send(JSON.stringify(socketMessage));
  }

  _close() {
    this._state = WebSocketState.Disconnected;
    this.close();
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

  _heartBeatRestart() {
    this._heartBeatHandler?.restart();
  }
  _heartBeatClose() {
    this._heartBeatHandler?.close();
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
