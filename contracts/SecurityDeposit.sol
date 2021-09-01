//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecurityDeposit {
    uint public delay = 4 weeks;
    uint public initiation;
    address payable public tenant;
    address payable public landlord;

    event Creation(address indexed _tenant, address indexed _landlord, uint _amount);
    event WithdrawFunds(address indexed agent);

    constructor(address payable _landlord) payable {
        tenant = payable(msg.sender);
        landlord = _landlord;
        initiation = block.timestamp;
        emit Creation(tenant, landlord, msg.value);
    }

    function getTransferDate() external view returns (uint){
        return initiation + delay;
    } 

    function withdrawFunds() external {
        require(address(this).balance > 0);
        if(block.timestamp - initiation < delay){
            require(msg.sender == tenant, "Only the tenant can withdraw before the delay.");
            tenant.transfer(address(this).balance);
            emit WithdrawFunds(tenant);
        }
        else{
            require(msg.sender == landlord, "Only the landlord can withdraw after the delay.");
            landlord.transfer(address(this).balance);
            emit WithdrawFunds(landlord);
        }
    }
}
