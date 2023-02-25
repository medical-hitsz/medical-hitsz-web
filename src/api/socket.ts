import { Manager } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { Message, MessageToSend } from "@/types/service";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";

const socketPath = import.meta.env.VITE_SOCKET_BASE_API;
let socket: null | Socket = null;

const tryInitSocket = (messageHandler: (msg: Message) => void) => {
  if (!socket) {
    const store = useUserStore();
    const manager = new Manager(socketPath, {
      query: {
        Authorization: "Bearer " + store.authorization,
      },
      transports: ["websocket"],
    });
    socket = manager.socket("/");
    socket.on("message", (data: Message) => {
      messageHandler(data);
    });
    socket.on("connect", () => {
      ElMessage.success("socket已连接！");
    });
    socket.on("disconnect", () => {
      ElMessage.error("socket已断开连接...");
    });
    socket.on("connect_error", () => {
      ElMessage.error("socket连接出错...");
    });
  }
};

const sendMessage = (msg: MessageToSend) => {
  if (socket) {
    socket.emit("message", msg);
  }
};

export { tryInitSocket, sendMessage };
