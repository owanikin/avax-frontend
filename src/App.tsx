import React, { useState, useEffect } from 'react';
import { Avalanche } from '@particle-network/chains';
// import { AAWrapProvider, SendTransactionMode, SmartAccount } from '@particle-network/aa';
import { notification } from 'antd';
import { ethers } from "ethers";
import { useEthereum, useConnect, useAuthCore  } from '@particle-network/auth-core-modal';
import logo from './logo.svg';
import './App.css';
import contractabi from './contract-abi.json';


  const App = () => {
    const { provider } = useEthereum();
    const { connect, disconnect } = useConnect();
    const { userInfo } = useAuthCore();
    const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

    const [contract, setContract] = useState(null as any);
    const [targetAmount, setTargetAmount] = useState(0);
    const [matchingAmount, setMatchingAmount] = useState(0);

    // Function to instantiate the contract
    const instantiateContract = async () => {
      if (provider) {
        const signer = ethersProvider.getSigner();
        const contractAddress = '0xd1cde0279b03bba29c18d60c25ac0dfca44d7d9f';
        const contractInstance = new ethers.Contract(contractAddress, contractabi, signer);
        setContract(contractInstance);
      }
    };

    useEffect(() => {
      instantiateContract();
    }, [provider]);

    const handleLogin = async (authType: any) => {
      if (!userInfo) {
        await connect({
          socialType: authType,
          chain: Avalanche,
        });
        instantiateContract();
      }
    }

    // Function to interact with the contract
    const startFund = async () => {
      if (contract) {
        try {
          const result = await contract.startFund(targetAmount);
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      }
    };

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
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))} placeholder='Enter Target Amount' />
              <button className="sign-message-button" onClick={startFund}>Start Fund</button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default App;
