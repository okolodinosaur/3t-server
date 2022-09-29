export enum MessageType {
  command = "command",
  status = "status",
  enemyDisconnect = "enemy_disconnect",
  winner = "winner",
  setSymbol = "set_symbol",
}

export interface MessageInterface {
  type: MessageType;
  message: string;
}
