//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./FarmNFT.sol";

contract SimpleFarm is KeeperCompatibleInterface {
    
    constructor(IERC20 _stakingToken, uint256 _updateInterval, FarmNFT _farmNFT) {
        stakingToken = _stakingToken;
        updateInterval = _updateInterval;
        lastUpdated = block.timestamp;   
        farmNFT = _farmNFT;
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
    uint256 tokenMultiplier = 1 * 10 ** 18;

    //update internvals
    uint256 public updateInterval;
    uint256 public lastUpdated;

    //nft contract ref
    FarmNFT public farmNFT;
    
    //FUNCTIONS
    //stake funds
    function stake(uint256 _amount) public {

        //check for pushing the element in the array
        bool checkForDuplicate;

        //value deposited cannot be zero
        require(_amount > 0, "Is this a joke to you?");

        //add to the already existing amount 
        stakingToken.transferFrom(msg.sender, address(this), _amount * tokenMultiplier);

        //update db
        userToAmountDeposited[msg.sender] += _amount;
        totalAmountInPool += _amount;

        //checking if the addy is already present
        //this could be added in as a helper functio for better readability
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
        stakingToken.transfer(msg.sender, _amount * tokenMultiplier);

        
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



    //chainlink keepers
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastUpdated) > updateInterval;
    }

    function performUpkeep(bytes calldata /* performData */) external override {

        //revalidating as per the docs
        if ((block.timestamp - lastUpdated) > updateInterval ) {
            lastUpdated = block.timestamp;

            //transfer NFTs to all wallets that are staking
            //looping through wallets
            for(uint counter=0; counter<allUsers.length; counter++){
                //checking if the balance is greater than zero
                if(userToAmountDeposited[allUsers[counter]] > 0){
                    //transferring nft
                    farmNFT.createNFT(allUsers[counter]);
                }
            }
        }
    }

    //calling the mapping function from the frontend doesnt always respond properly
    //hence making a getter function
    function getUserToAmountDeposited() public view returns (uint256){
        return userToAmountDeposited[msg.sender];
    }

    //pls dont ask me why im adding these
    receive() external payable {}
    fallback() external payable {}

}