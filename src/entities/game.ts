import { MessageInterface, MessageType } from "@interfaces/message.interface";
import { PlaySymbolType } from "@interfaces/playSymbol.interface";
import { Client } from "@entities/client";
import { v4 } from "uuid";

export class Game {
  players: Client[] = [];
  id: string;
  playerStep: Client;
  winner: PlaySymbolType;
  winCombination: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // 012
  // 345
  // 678

  constructor(players: Client[]) {
    this.id = v4();
    this.players = players.map((p) => {
      p.status = false;
      p.gameId = this.id;
      return p;
    });

    if (Math.random() < 0.5) {
      players[0].setSymbol(PlaySymbolType.X);
      players[1].setSymbol(PlaySymbolType.O);
    } else {
      players[0].setSymbol(PlaySymbolType.O);
      players[1].setSymbol(PlaySymbolType.X);
    }

    players.forEach((p) => {
      if (p.symbol === PlaySymbolType.X) this.playerStep = p;
      p.sendSelf({ type: MessageType.setSymbol, message: p.symbol });
    });
  }

  hisStep(client: Client): boolean {
    return this.playerStep === client;
  }

  getPlayerBySymbol(symbol: PlaySymbolType): Client {
    return this.players.filter((p) => p.symbol === symbol)[0];
  }

  emptyField(id: number): boolean {
    return !this.players[0].state.includes(id) && !this.players[1].state.includes(id);
  }

  sendAllPlayers(msg: MessageInterface) {
    this.players.forEach((p) => p.sendSelf(msg));
  }

  isWin(player: Client): boolean {
    let win: number[] = [];
    if (player.state.length > 2) {
      this.winCombination.forEach((combination) => {
        combination.forEach((v) => (player.state.includes(v) ? win.push(v) : null));
        if (win.length < 3) win = [];
      });
      if (win.length > 2) {
        this.winner = player.symbol;
        return true;
      } else return false;
    } else {
      return false;
    }
  }

  show() {
    console.clear();
    let text: string = `################## Tic-tac-toe ##################\n`;
    text += `# Game id: ${this.id} #\n`;
    text += `# Step of: ${this.playerStep.symbol}                                    #\n`;
    text += `# Winner: ${
      this.winner
        ? this.winner + "                                     #\n"
        : "This game is on                       #\n"
    }`;
    text += `#################################################\n`;
    console.log(text);
  }

  move(symbol: PlaySymbolType, id: number) {
    const player = this.getPlayerBySymbol(symbol);

    if (this.emptyField(id)) {
      this.sendAllPlayers({
        type: MessageType.command,
        message: String(id) + `_${symbol}`,
      });

      player.state.push(id);
      this.players.forEach((p) => {
        if (p !== player) {
          this.playerStep = p;
          p.sendSelf({ type: MessageType.status, message: "Your step" });
        } else {
          p.sendSelf({ type: MessageType.status, message: "Wait enemy" });
        }
      });
    }
  }
}
