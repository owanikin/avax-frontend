import React, { useState, useEffect } from 'react';
import { AvalancheTestnet } from '@particle-network/chains';
import { notification } from 'antd';
import { ethers } from "ethers";
import { useEthereum, useConnect, useAuthCore  } from '@particle-network/auth-core-modal';
import logo from './logo.svg';
import './App.css';
import contractabi from './contract-abi.json';
import FundCard from './FundCard';
import { Fund } from './Fund';


  const App = () => {
    const { provider, address } = useEthereum();
    const { connect, disconnect } = useConnect();
    const { userInfo } = useAuthCore();
    const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

    const [contract, setContract] = useState(null as any);
    const [targetAmount, setTargetAmount] = useState(0);
    const [purpose, setPurpose] = useState("");
    const [activeFunds, setActiveFunds] = useState<Fund[]>([]);
    const [contributionAmount, setContributionAmount] = useState(0);
    const [matchingAmount, setMatchingAmount] = useState(0);
    const [fundAddress, setFundAddress] = useState("0x" as any);


    // Function to instantiate the contract
    const instantiateContract = async () => {
      if (provider) {
        const signer = ethersProvider.getSigner();
        const contractAddress = '0x892c40998e7ad1b8de7b559f35d20e4fbfeed4a8';
        const contractInstance = new ethers.Contract(contractAddress, contractabi, signer);
        setContract(contractInstance);
      }
    };

    useEffect(() => {
      instantiateContract();
    }, [provider]);

    useEffect(() => {
      if (contract) {
        fetchActiveFunds();
      }
    }, [contract]);

    const handleLogin = async (authType: any) => {
      if (!userInfo) {
        await connect({
          socialType: authType,
          chain: AvalancheTestnet,
        });
        instantiateContract();
      }
    }

    const fetchActiveFunds = async () => {
      try {
        const funds = await contract.getActiveFunds();
        setActiveFunds(funds);
        console.log(userInfo)
      } catch (error) {
        console.error("Error fetching active funds: ", error);
      }
    }

    // Function to interact with the contract
    const startFund = async () => {
      let fundAddress;
      if (contract) {
        try {
          const result = await contract.startFund(targetAmount, purpose);
          console.log(result);
          fetchActiveFunds();
          fundAddress = result.address;
        } catch (error) {
          console.error(error);
        }
        const newFund: Fund = {targetAmount, amountRaised: 0, purpose};
          setActiveFunds(prevFunds => [...prevFunds, newFund]);
          console.log(activeFunds);
      }

      return fundAddress;
    };

    const contributionToFund = async (fundAddress: any) => {
      if (contract && contributionAmount > 0) {
        try {
          const tx = await contract.contribute(fundAddress, {value: contributionAmount});
          await tx.wait();
          console.log("Contribution successful");
          fetchActiveFunds();
        } catch (error) {
          console.error("Error contributing to fund: ", error);
        }
      }
    }

    const pledgeMatchingFunds = async (fundOwner: string, matchingAmount: number) => {
      if (contract) {
        try {
          // Call the pledgeMatchingFunds function on the contract
          const tx = await contract.pledgeMatchingFunds(fundOwner, matchingAmount, {value: matchingAmount});
          await tx.wait();
          console.log("Matching funds pledged successfully");
          fetchActiveFunds();
        } catch (error) {
          console.error("Error pledging matching funds: ", error);
        }
      }
    }

    

    return (
      <div className="App">
        <div className="logo-section">
          <img src="https://i.imgur.com/EerK7MS.png" alt="Logo 1" className="logo logo-big" />
          <img src="https://i.imgur.com/eBJAx0s.png" alt="Logo 2" className="logo logo-big" />
        </div>
        {!userInfo ? (
          <div className="login-section">
            <button className="sign-button google-button" onClick={() => handleLogin('google')}>
              <img src="https://i.imgur.com/nIN9P4A.png" alt="Google" className="icon"/>
              Sign in with Google
            </button>
            <button className="sign-button twitter-button" onClick={() => handleLogin('twitter')}>
              <img src="https://i.imgur.com/afIaQJC.png" alt="Twitter" className="icon"/>
              Sign in with X
            </button>
            <button className="sign-button other-button" onClick={() => handleLogin('')}>
              <img src="https://i.imgur.com/VRftF1b.png" alt="Twitter" className="icon"/>
            </button>
          </div>
        ) : (
          <div className="profile-card">
            <h2>{userInfo.name}</h2>
            <div className="balance-section">
              <button className="disconnect-button" onClick={disconnect}>Logout</button>
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))} placeholder="How much would you like to raise?" />
              <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What are you fundraising for?" />
              <button className="sign-message-button" onClick={startFund}>Start a FundMe</button>
              <input type="number" value={contributionAmount} onChange={(e) => setContributionAmount(Number(e.target.value))} placeholder="Contribution amount" />
              <button className="sign-message-button" onClick={contributionToFund}>Contribute to Fund</button>

              <input type="text" value={matchingAmount} onChange={(e) => setMatchingAmount(Number(e.target.value))} placeholder="Matching amount" />
              <button className="sign-message-button" onClick={() => pledgeMatchingFunds(fundAddress, matchingAmount)}>Pledge Matching Funds</button>
              
            </div>
            {/* Render active funds */}
            <div className="active-funds">
              {activeFunds.map((fund, index) => (
                <FundCard key={index} fund={fund} />
              ))}
            </div>

          </div>
        )}
      </div>
    );
  };

export default App;
