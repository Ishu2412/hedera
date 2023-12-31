// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract Data {
    struct UserData {
        uint unqId;
        uint hashcode;
    }

    mapping(address => UserData[]) private userMappings;

    // constructor
    constructor(uint _initialUnqId, uint _initialHashcode) {
        UserData memory initialUser = UserData({
            unqId: _initialUnqId,
            hashcode: _initialHashcode
        });

        userMappings[msg.sender].push(initialUser);
    }

    // Function to store data in the smart contract
    function storeDataSmart(uint _unqId, uint _hashcode) public {
        UserData memory newUser = UserData({
            unqId: _unqId,
            hashcode: _hashcode
        });

        userMappings[msg.sender].push(newUser);
    }

    // Function to retrieve data from the smart contract
    function retrieveDataSmart() public view returns (UserData[] memory) {
        return userMappings[msg.sender];
    }
}
