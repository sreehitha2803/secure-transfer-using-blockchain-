// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder {
    uint256 public numOfFunders;
    mapping(uint256 => address) private funders;

    receive() external payable {}
    function transfer(address recipient) external payable {
        require(msg.value == 2 ether, "You must send exactly 2 Ether.");
        funders[numOfFunders] = msg.sender;
        numOfFunders++;
        payable(recipient).transfer(2 ether);
    }
}
