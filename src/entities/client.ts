import { WebSocket } from "ws";
import { PlaySymbolType } from "@/interfaces/playSymbol.interface";
import { MessageInterface } from "@/interfaces/message.interface";

export class Client {
  ws: WebSocket;
  status: boolean;
  symbol: PlaySymbolType;
  gameId: string;
  state: number[] = [];

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.status = false;
  }

  sendSelf(msg: MessageInterface) {
    this.ws.send(JSON.stringify(msg));
  }

  setReady(): Client {
    this.status = true;
    return this;
  }

  setSymbol(symbol: PlaySymbolType) {
    this.symbol = symbol;
  }
}
