//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Farm {
    
    constructor(IERC20 _stakingToken) {
        stakingToken = _stakingToken;
    }

    //DB
    //Pool array
    IERC20 public stakingToken;

    //user mapping
    mapping(address => uint256) public userToAmountDeposited;

    //total amount deposited in pool
    uint256 public totalAmountInPool;

    //keeping a track of users for keeper
    address[] public allUsers;

    //multiplier for ease
    // uint256 tokenMultiplier = 1 * 10 **18;

    //token-emisson per hour
    uint256 emissionPerHour = 100;
    
    //FUNCTIONS
    //stake funds
    function stake(uint256 _amount) public {

        //check for pushing the element in the array
        bool checkForDuplicate;

        //value deposited cannot be zero
        require(_amount > 0, "Is this a joke to you?");

        //add to the already existing amount 
        stakingToken.transferFrom(msg.sender, address(this), _amount);

        //update db
        userToAmountDeposited[msg.sender] += _amount;
        totalAmountInPool += _amount;

        //checking if the addy is already present
        for(uint32 counter=0; counter<allUsers.length; counter++){
            if(msg.sender == allUsers[counter]){
                checkForDuplicate = true;
            }
        }

        //pushing if the addy is not present
        if(!checkForDuplicate)
            allUsers.push(msg.sender);

    }


    //withdraw funds 
    function withdrawFundsFromPool(uint256 _amount) public {

        //value deposited cannot be zero
        require(_amount <= userToAmountDeposited[msg.sender], "Is this a joke to you?");

        //reduce from already existing amount 
        userToAmountDeposited[msg.sender] -= _amount;
        totalAmountInPool -= _amount;

        //transfer from contract to wallet
        stakingToken.transfer(msg.sender, _amount);

        

        //call withdraw yeild here

    }

    //returns the pool balance
    function getContractBalance() public view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }

    //withdraw funds from the contract
    //this will be under multisig
    function withdrawFundsFromContract(address _to) public {
        stakingToken.transfer(_to, stakingToken.balanceOf(address(this)));
    }


    //would need these incase withdrawFundsFromContract gets called
    //need gas for transferring - duh!
    receive() external payable {}
    fallback() external payable {}
    
    //withdraw yeild
    function withdrawYeild() public {

        //calc total yeild
        //calc user yeild
        //transfer yeild
        

    }

    function calcUserYield(address _owner) internal view returns (uint256){
        //find percentage of user's stake in protocol
        uint256 percentageStake = (userToAmountDeposited[_owner]/totalAmountInPool)*100;

        //return %age of emission that user gets
        return emissionPerHour/percentageStake;
    }
    //emissions calculation will go here
    //calculate a user's yield
    //add new pool

    //NOTES
    //yeild would be based on multiple factors
    //-> time
    //-> user's contribution
    //yeild emission after every 1 hour
}