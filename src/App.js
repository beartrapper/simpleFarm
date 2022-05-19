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
  const [fetchData, setFetchData] = useState(true);

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
        signer
      );

      //getting the farm NFT contract
      const contractFarmNFT = new ethers.Contract(
        artifactNFT.address,
        artifactNFT.abi,
        signer
      );

      //getting the testnet dai contract
      const contractTestnetDai = new ethers.Contract(
        artifactDAI.address,
        artifactDAI.abi,
        signer
      );

      console.log(contractFarm.userToAmountDeposited(addr));
      console.log(contractFarmNFT);
      console.log(contractTestnetDai);

      setFarmContract(contractFarm);
      setFarmNFTContract(contractFarmNFT);
      setTestnetDaiContract(contractTestnetDai);
      setCurrentUserAddress(addr);

      //CALLING PRE-REQ FUNCTIONS
      //get user amount staked
      contractFarm
        .userToAmountDeposited(addr)
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

      // getRewardNFTs();
      contractFarmNFT
        .balanceOf(addr)
        .then((res) => {
          setRewards(res.toString());
        })
        .catch((err) => {
          console.log(
            "your code made a poopoo while fetching nft rewards: ",
            err
          );
        });

      // checkApproved();
      contractTestnetDai
        .allowance(addr, artifact.address)
        .then((res) => {
          console.log(res.toString());
          //disable if already approved
          if (res.toString() > 900000000000000000000) setApproveButton(false);
        })
        .catch((err) => {
          console.log("your code made a poopoo on checking approval: ", err);
        });

      // getTotalValuePooled();
      contractFarm
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

    //call the func
    setup();
  }, []);

  //approve the contract
  const getApproved = () => {
    testnetDaiContract
      .approve(artifact.address, approvalAmount)
      .then((res) => {
        console.log(res);
        //update state

        //wait for transaction to complete
        res.wait().then(() => setApproveButton(false));
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
        .withdrawFundsFromPool(amount)
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

  return (
    <div>
      {!fetchData ? (
        <div>Loading</div>
      ) : (
        <div className="main-div">
          {/* <button className="button-9" onClick={() => setup()}>
            Connect wallet
          </button> */}
          <div className="row1-container">
            <div className="box box-down cyan">
              <h2>Total Value Pooled: {totalPooled}</h2>
            </div>

            <div className="box red">
              <h2>
                Amount: {"               "}
                <input
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </h2>{" "}
            </div>

            <div className="box box-down blue">
              <h2>Rewards: {rewards} NFTs</h2>
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
              <button
                className="button-9"
                role="button"
                onClick={() => stake()}
              >
                Stake
              </button>{" "}
              {"   "}
              <button
                className="button-9"
                role="button"
                onClick={() => withdraw()}
              >
                Unstake
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
