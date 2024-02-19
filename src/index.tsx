import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthType } from '@particle-network/auth-core';
import { AvalancheTestnet } from '@particle-network/chains';
import { AuthCoreContextProvider, PromptSettingType } from '@particle-network/auth-core-modal'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import('buffer').then(({ Buffer }) => {
  window.Buffer = Buffer;
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: process.env.REACT_APP_PROJECT_ID ?? "",
        clientKey: process.env.REACT_APP_CLIENT_KEY ?? "",
        appId: process.env.REACT_APP_APP_ID ?? "",
        authTypes: [AuthType.email, AuthType.google, AuthType.twitter],
        themeType: 'dark',
        fiatCoin: 'USD',
        language: 'en',
        // erc4337: {
        //   name: 'SIMPLE',
        //   version: '1.0.0',
        // },
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
          promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
        },
        wallet: {
          visible: true,
          customStyle: {
            supportChains: [AvalancheTestnet],
          }
        },
      }}
    >
    <App />
      </AuthCoreContextProvider>
  </React.StrictMode>
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
