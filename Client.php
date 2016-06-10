<?php

/**
 * Created by PhpStorm.
 * User: root
 * Date: 16-6-9
 * Time: 下午4:13
 */
class Client
{
    var $socket;
    var $op_client;

    var $index;     //自己的数组索引
    var $op_index; //对手的数组索引
    
    var $username;
    var $isPaired;
    var $isReady;
    function Client($socket, $index) {
        $this->socket = $socket;
        $this->isPaired = false;
        $this->op_index = -1;
        $this->index = $index;
        $this->username = "无名";
        $this->isReady = false;
        $this->op_socket = null;
        $this->op_client = null;
    }

    function searchforOp($ws) {
        //最简单的，顺序搜索
        foreach ($ws->clients as $key => $value) {
            if($value->isPaired === false && $key !== $this->index) {
                //如果找到没有配对的，且不是自己 
                $this->isPaired = true;
                $value->isPaired = true;
                $this->op_index = $key;
                $value->op_index = $this->index;
                $this->op_client = $value;
                $value->op_client = $this;
                return true;
            }
        }
        return false;
    }
    function getUsername() {
        return $this->username;
    }
    function setUsername($username) {
        $this->username = $username;
    }
    
    function getOpSocket() {
        return$this->op_socket;
    }

    /**
     * @return mixed
     */
    public function getSocket()
    {
        return $this->socket;
    }

    /**
     * @param mixed $socket
     */
    public function setSocket($socket)
    {
        $this->socket = $socket;
    }

    /**
     * @return boolean
     */
    public function getIsPaired()
    {
        return $this->isPaired;
    }

    /**
     * @param boolean $isPaired
     */
    public function setIsPaired($isPaired)
    {
        $this->isPaired = $isPaired;
    }

    /**
     * @return int
     */
    public function getOpIndex()
    {
        return $this->op_index;
    }

    /**
     * @param int $pair_op
     */
    public function setOpIndex($pair_op)
    {
        $this->op_index = $pair_op;
    }

    /**
     * @return mixed
     */
    public function getIndex()
    {
        return $this->index;
    }

    /**
     * @param mixed $index
     */
    public function setIndex($index)
    {
        $this->index = $index;
    }
    
    /**
     * @return mixed
     */
    public function getIsReady()
    {
        return $this->isReady;
    }

    /**
     * @param mixed $isReady
     */
    public function setIsReady($isReady)
    {
        $this->isReady = $isReady;
    }
    
    /**
     * @return null
     */
    public function getOpClient()
    {
        return $this->op_client;
    }

    /**
     * @param null $op_client
     */
    public function setOpClient($op_client)
    {
        $this->op_client = $op_client;
    }
}