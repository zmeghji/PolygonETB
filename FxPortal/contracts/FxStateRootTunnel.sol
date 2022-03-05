// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FxBaseRootTunnel} from "./tunnel/FxBaseRootTunnel.sol";

contract FxStateRootTunnel is FxBaseRootTunnel{

    bytes public latestData;

    constructor(address _checkpointManager, address _fxRoot)
        FxBaseRootTunnel(_checkpointManager, _fxRoot) {}

     /**
     * @notice Process message received from Child Tunnel
     * @dev function needs to be implemented to handle message as per requirement
     * This is called by onStateReceive function.
     * Since it is called via a system call, any event will not be emitted during its execution.
     * @param message bytes message that was sent from Child Tunnel
     */
    function _processMessageFromChild(bytes memory message) override internal{
        latestData = message;
    }
    function sendMessageToChild(bytes memory message) public {
        _sendMessageToChild(message);
    }

}