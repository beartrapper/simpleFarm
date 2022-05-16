//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FarmNFT is ERC721 {

    //tracking the total number of NFTs
    uint256 public totalNumberOfNFTs;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol){

    }

    function createNFT(address _user) public {
        
        //safemint is already available in the parent class
        //takes in two args
        _safeMint(_user, totalNumberOfNFTs);
        ++totalNumberOfNFTs;

    }
}
