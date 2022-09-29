import "reflect-metadata"
import { Game } from "@entities/game"
import { Client } from "@entities/client"
import WebSocket from "ws"
import { injectable } from "inversify"

@injectable()
export class ServerServices {
  private server: WebSocket.Server<WebSocket.WebSocket>
  clients: Client[] = []
  games: Game[] = []

  constructor(server: WebSocket.Server<WebSocket.WebSocket>) {
    this.server = server
  }

  getOnline(): number {
    return this.clients.length
  }

  sendAll(msg: string) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(msg)
    })
  }

  getOneClientByWs(ws: WebSocket): Client {
    return this.clients.filter((c) => c.ws === ws)[0]
  }

  getReadyClient(ws: WebSocket): Client {
    return this.clients.filter((c) => c.status && c.ws !== ws)[0]
  }

  getOneGameById(id: string): Game {
    return this.games.filter((g) => g.id === id)[0]
  }

  //   personalSend(sender:, rec)
}
