<?php

$debug = true;
error_reporting(E_ALL);
require('class_ws.php');
if($debug) {
    $ws = new Ws('127.0.0.1', '60000', 100);
}
else {
    $ws = new Ws('114.215.85.18', '60000', 100);
}
$ws->function['add'] = 'user_add_callback';
$ws->function['send'] = 'send_callback';
$ws->function['close'] = 'close_callback';
$ws->start_server();

//回调函数们
function user_add_callback($index, $ws)
{
    $ws->clients[$index]->setIsReady(false);
    $ws->clients[$index]->setIsPaired(false);
}

function allocate_color($ws, $index1, $index2)
{
    $color = rand() % 2 ? "black" : "white";
    $othercolor = "";
    if ($color === "black") $othercolor = "white";
    elseif ($color === "white") $othercolor = "black";

    send_to_one($color, "tellcolor", $ws, $index1);
    send_to_one($othercolor, "tellcolor", $ws, $index2);
}

function close_callback($ws, $index)
{
    $data = "玩家 " . $ws->clients[$index]->getUsername() . "离开了游戏";
    send_to_op($data, 'notice', $ws, $index);
    unset($ws->clients[$index]);
}

/**
 * @param $data
 * @param $index
 * @param $ws
 */
function send_callback($data, $index, $ws)
{
//    var_dump($ws->clients[$index]);
//    var_dump($ws->clients[$index]->getOpClient());
    //接受到客户端套接字数据时的用户回调函数
    if (!$data) return;

    $client = $ws->clients[$index];
    $data = json_decode($data, true);
    if ($data['type'] === "fall") {
        send_to_op(json_encode($data), 'fall', $ws, $index);
    } elseif ($data['type'] === "control") {
        //TODO
        if ($data['msg'] === "isReady") {
            if(is_null($ws->clients[$index]->getOpClient())) {
                return;
            }

            $ws->clients[$index]->setIsReady(true);
            if ($ws->clients[$index]->getOpClient()->getIsReady() ) {
                $op_index = $ws->clients[$index]->getOpIndex();
                allocate_color($ws, $index, $ws->clients[$index]->getOpIndex());
                send_to_one("gameBegin", "control", $ws, $index);
                $data = "游戏开始\n你的对手为: " . $ws->clients[$op_index]->getUsername();
                send_to_one($data, "notice", $ws, $index);
                send_to_one("gameBegin", "control", $ws, $ws->clients[$index]->getOpIndex());
                $data = "游戏开始\n你的对手为: " . $ws->clients[$index]->getUsername();
                send_to_one($data, "notice", $ws, $op_index);
            }
        } elseif ($data['msg'] === "gameover") {
            $ws->clients[$index]->setIsReady(false);
            $ws->clients[$index]->getOpClient()->setIsReady(false);
        } elseif ($data['msg'] === "searchforOp") {
            if($client->searchforOp($ws)) {
                $data = "匹配到对手" . $client->getOpClient()->getUsername();
                send_to_one($data, "notice", $ws, $index);
                $data = "匹配到对手" . $client->getUsername();
                send_to_op($data, "notice", $ws, $index);
            } else {
//                $data = "正在为您匹配中,尚未匹配到对手,请过一段时间再次点击匹配按钮";
                $data = "not found opposite yet, please click match button later";
                send_to_one($data, "notice", $ws, $index);
            }
        }
    } elseif ($data['type'] === "setUsername") {
        $ws->clients[$index]->setUsername($data['msg']);
    } elseif ($data['type'] === "chat") {
        $data = $ws->clients[$index]->getUsername() . ": " . $data['msg'] . "\n";
        send_to_op($data, "chat", $ws, $index);
    }
}

function send_to_all($data, $type, $ws)
{
    $res = array(
        'msg' => $data,
        'type' => $type,
    );
    $res = json_encode($res);
    $res = $ws->frame($res);
    foreach ($ws->accept as $key => $value) {
        socket_write($value, $res, strlen($res));
    }
}

function send_to_other($data, $type, $ws, $index)
{
    $res = array(
        'msg' => $data,
        'type' => $type,
    );
    $res = json_encode($res);
    $res = $ws->frame($res);
    foreach ($ws->accept as $key => $value) {
        if ($key === $index) {
            continue;
        }
        socket_write($value, $res, strlen($res));
    }

}

function send_to_one($data, $type, $ws, $index)
{
    $res = array(
        'msg' => $data,
        'type' => $type,
    );
    $res = json_encode($res);
    $res = $ws->frame($res);
    socket_write($ws->accept[$index], $res, strlen($res));

}

function send_to_op($data, $type, $ws, $index) 
{
    //send to the opposite player of player index
    $res = array(
        'msg' => $data,
        'type' => $type,
    );
    $res = json_encode($res);
    $res = $ws->frame($res);
    var_dump($res);
    socket_write($ws->clients[$index]->getOpClient()->getSocket(), $res, strlen($res));
}