import { ethers } from "ethers";
import { useEffect } from "react";

function App() {
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

      //getting the contract
      // const contractValue = new ethers.Contract(
      //   artifact.address,
      //   artifact.abi,
      //   provider.getSigner()
      // );

      // setContract(contractValue);
      // setCurrentUserAddress(addr);
      //this has to be inside this function
      //caling it outside would make call the greet function on an unresolved promise
      // setFetchData(true);
    };

    setup();
  }, []);

  return (
    <div>
      <input type="number" />
      <br />
      <button>Approve</button>
      <br />
      <button>Stake</button>
      <br />
      <button>Unstake</button>
      <br />
      <br />
      Your Stake:
    </div>
  );
}

export default App;
