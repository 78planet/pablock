pragma solidity  ^0.4.24;

contract ContHash {

    mapping(uint => string) cont;


    function addConhash(uint c_code, string hashContinfo) public {
        cont[c_code] = hashContinfo;
    }

    function getContHash(uint c_code) public view returns (string) {
        return cont[c_code];
    }
}