import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifactNFT from "./compiled-json/farmNFT.json";
import artifactDAI from "./compiled-json/testnetDai.json";
import artifact from "./compiled-json/farm.json";

function App() {
  //contracts
  const [farmContract, setFarmContract] = useState(0);
  const [farmNFTContract, setFarmNFTContract] = useState(0);
  const [testnetDaiContract, setTestnetDaiContract] = useState(0);
  const [currentUserAddress, setCurrentUserAddress] = useState(0);

  //laoding check
  const [fetchData, setFetchData] = useState(false);

  //enable/disbale approve button
  const [approveButton, setApproveButton] = useState(true);

  //approval ammount
  const approvalAmount = "99999999999999999999999999999999";

  //deposit-amount
  const [amount, setAmount] = useState(0);

  //current user states
  //staked
  const [amountStaked, setAmountStaked] = useState(0);
  //rewards
  const [rewards, setRewards] = useState(0);
  //total pool
  const [totalPooled, setTotalPooled] = useState(0);

  useEffect(() => {
    //cant use asycn with useEffect, it causes a race condition
    //instead making another async function

    const setup = async () => {
      //getting wallet and addresses
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();

      //getting the farm contract
      const contractFarm = new ethers.Contract(
        artifact.address,
        artifact.abi,
        provider.getSigner()
      );

      //getting the farm NFT contract
      const contractFarmNFT = new ethers.Contract(
        artifactNFT.address,
        artifactNFT.abi,
        provider.getSigner()
      );

      //getting the testnet dai contract
      const contractTestnetDai = new ethers.Contract(
        artifactDAI.address,
        artifactDAI.abi,
        provider.getSigner()
      );

      setFarmContract(contractFarm);
      setFarmNFTContract(contractFarmNFT);
      setTestnetDaiContract(contractTestnetDai);
      setCurrentUserAddress(addr);

      //calling pre-req functions
      getTotalValuePooled();
      stakedAmount();
      checkApproved();
      getRewardNFTs();
      // this has to be inside this function
      setFetchData(true);
    };

    setup();
  }, []);

  //dai token approval function
  const checkApproved = () => {
    testnetDaiContract
      .allowance(currentUserAddress, artifact.address)
      .then((res) => {
        console.log(res.toString());
        console.log(res.toString() == approvalAmount);
        //disable if already approved
        if (res.toString() == approvalAmount) setApproveButton(false);
      })
      .catch((err) => {
        console.log("your code made a poopoo on checking approval: ", err);
      });
  };

  //approve the contract
  const getApproved = () => {
    testnetDaiContract
      .approve(artifact.address, approvalAmount)
      .then((res) => {
        //update state
        setApproveButton(false);
      })
      .catch((err) => {
        console.log("your code made a poopoo on approval: ", err);
      });
  };

  //stake function
  const stake = () => {
    farmContract
      .stake(amount)
      .then((res) => {
        //call staked function
        farmContract
          .userToAmountDeposited(currentUserAddress)
          .then((res) => {
            //update state
            setAmountStaked(res.toString());
          })
          .catch((err) => {
            console.log(
              "your code made a poopoo while fetching staked amount: ",
              err
            );
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //withdraw function
  const withdraw = () => {
    if (amount <= amountStaked) {
      farmContract
        .withdraw(amount)
        .then((res) => {
          //call staked function
          farmContract
            .userToAmountDeposited(currentUserAddress)
            .then((res) => {
              //update state

              setAmountStaked(res.toString());
            })
            .catch((err) => {
              console.log(
                "your code made a poopoo while fetching staked amount: ",
                err
              );
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("what do you think you're doing?");
    }
  };

  //get current stake
  const stakedAmount = () => {
    farmContract
      .userToAmountDeposited(currentUserAddress)
      .then((res) => {
        //update state
        setAmountStaked(res.toString());
      })
      .catch((err) => {
        console.log(
          "your code made a poopoo while fetching staked amount: ",
          err
        );
      });
  };

  //get total value locked in pool
  const getTotalValuePooled = () => {
    farmContract
      .totalAmountInPool()
      .then((res) => {
        //update state
        setTotalPooled(res.toString());
      })
      .catch((err) => {
        console.log(
          "your code made a poopoo while fetching total value pooled: ",
          err
        );
      });
  };

  //get reward NFTs
  const getRewardNFTs = () => {
    farmNFTContract
      .balanceOf(currentUserAddress)
      .then((res) => {
        setRewards(res.toString());
      })
      .catch((err) => {
        console.log(
          "your code made a poopoo while fetching nft rewards: ",
          err
        );
      });
  };

  return (
    <div className="main-div">
      <div className="row1-container">
        <div className="box box-down cyan">
          <h2>Total Value Pooled: {totalPooled}</h2>
        </div>

        <div className="box red">
          <h2>
            Amount: {"               "}
            <input type="number" onChange={(e) => setAmount(e.target.value)} />
          </h2>{" "}
        </div>

        <div className="box box-down blue">
          <h2>Rewards: {rewards}</h2>
        </div>
      </div>
      <div className="row2-container">
        <div className="box orange">
          <h2>Your Stake: {amountStaked}</h2>
        </div>
      </div>
      {approveButton ? (
        <button
          className="button-9"
          role="button"
          onClick={() => getApproved()}
        >
          Approve
        </button>
      ) : (
        <div>
          <br />
          <button className="button-9" role="button" onClick={() => stake()}>
            Stake
          </button>{" "}
          {"   "}
          <button className="button-9" role="button" onClick={() => withdraw()}>
            Unstake
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
