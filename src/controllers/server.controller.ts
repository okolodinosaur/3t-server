import { MessageType } from "@/interfaces/message.interface";
import { Client } from "@entities/client";
import { Game } from "@entities/game";
import { TYPES } from "@interfaces/types";
import { ServerServices } from "@services/server.services";
import { inject } from "inversify";
import { WebSocket } from "ws";

export class ServerController {
  constructor(@inject(TYPES.ServerService) private readonly serverService: ServerServices) {}

  addPlayer(ws: WebSocket) {
    this.serverService.clients.push(new Client(ws));
  }

  initGame(ws: WebSocket) {
    const player = this.serverService.getOneClientByWs(ws).setReady();
    const enemy = this.serverService.getReadyClient(ws);
    console.log("Client is ready!");

    if (enemy) {
      const game = new Game([player, enemy]);
      this.serverService.games.push(game);
      console.log("Game was created!");
    }
  }

  step(ws: WebSocket, id: number) {
    const client = this.serverService.getOneClientByWs(ws);
    const game = this.serverService.getOneGameById(client.gameId);

    if (!game.hisStep(client)) {
      client.sendSelf({ type: MessageType.status, message: "Not your step!!" });
    } else {
      game.move(client.symbol, id);
      game.isWin(client) ? game.sendAllPlayers({ type: MessageType.winner, message: client.symbol }) : null;
      game.show();
    }
  }

  close(ws: WebSocket) {
    const client = this.serverService.getOneClientByWs(ws);
    console.log("Client was closed");

    const game = this.serverService.getOneGameById(client.gameId);

    if (game) {
      game.players
        .filter((p) => p.ws !== ws)[0]
        .sendSelf({
          type: MessageType.enemyDisconnect,
          message: "Your enemy was disconnected...",
        });
      this.serverService.games = this.serverService.games.filter((g) => g !== game);
    }

    this.serverService.clients = this.serverService.clients.filter((c) => c.ws !== ws);
  }
}
