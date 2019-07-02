pragma solidity  ^0.4.24;

contract CareerHash {

    mapping(string => string) career;


    function addCareehash(string em_code, string hashCareinfo) public {
        career[em_code] = hashCareinfo;
    }

    function getCareeHash(string em_code) public view returns (string) {
        return career[em_code];
    }
}