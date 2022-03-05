// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FxBaseChildTunnel} from "./tunnel/FxBaseChildTunnel.sol";

contract FxStateChildTunnel is FxBaseChildTunnel {
    uint256 public latestStateId;
    address public latestRootMessageSender;
    bytes public latestData;

    constructor(address _fxChild) FxBaseChildTunnel(_fxChild){}

    /**
     * @notice Process message received from Root Tunnel
     * @dev function needs to be implemented to handle message as per requirement
     * This is called by onStateReceive function.
     * Since it is called via a system call, any event will not be emitted during its execution.
     * @param stateId unique state id
     * @param sender root message sender
     * @param message bytes message that was sent from Root Tunnel
     */
    function _processMessageFromRoot(uint256 stateId, address sender, bytes memory message) 
        override internal validateSender(sender){
        latestStateId = stateId;
        latestRootMessageSender = sender;
        latestData = message;
    }

     function sendMessageToRoot(bytes memory message) public {
        _sendMessageToRoot(message);
    }
}