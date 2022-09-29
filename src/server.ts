import WebSocket from "ws";
import "dotenv/config";
import { ServerServices } from "@services/server.services";
import { ServerController } from "@controllers/server.controller";

const server = new WebSocket.Server({ port: Number(process.env.PORT) }, () => {
  console.log(`### Server started on port ${process.env.PORT}`);
});
const serverController = new ServerController(new ServerServices(server));

server.on("connection", (ws) => {
  serverController.addPlayer(ws);

  ws.on("message", (msg) => {
    const text = msg.toString("utf-8").split("_");
    switch (text[0]) {
      case "true":
        serverController.initGame(ws);
        break;
      case "ID":
        serverController.step(ws, +text[1]);
        break;
      default: {
        break;
      }
    }
  });

  ws.on("close", () => {
    serverController.close(ws);
  });
});
