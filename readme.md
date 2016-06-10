# 来自玩家的意见
## from MuMu 有一方落子后用框框圈出落子的位置
## 白底棋盘和logo让人看不清白子的位置


# 构思

Client 类
保存一个客户端连接的各种信息，包括socket, username, ispaired, op_socket等等

同时为了少改动原有代码, 仍然维护一个accept数组，用来保存所有和客户端的连接，同时通过数组索引index 来和accept_clients数组建立对应关系.

正在考虑是否加入房间机制，建立Room对象
