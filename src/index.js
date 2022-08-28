import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {MoralisProvider} from "react-moralis";

ReactDOM.render(
  //mainnet server <MoralisProvider appId="f7r18HAbBn0gGcC1lyVBniHLEqoeRROxKfd5UepV" serverUrl="https://hj9hjla7la12.usemoralis.com:2053/server">
    //testnet server 
     <MoralisProvider appId="EBEfcmLcjG607n7w8PyhgeBbM3MbXxqWwtoMJxxV" serverUrl="https://qwgjlixghv7t.usemoralis.com:2053/server">
  <App />
</MoralisProvider>,
  document.getElementById('root')
);

reportWebVitals();