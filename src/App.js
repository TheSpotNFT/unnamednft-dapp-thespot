import React, {useEffect} from "react";
import "./App.css";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { Nav } from "./components/Nav";
import { Board } from "./components/pages/Board";
import Authenticate from "./components/Authenticate";
import { useChain } from "react-moralis";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Roadmap from "./components/pages/roadmap";
import Team from "./components/pages/team";
import Footer from "./components/Footer";
import Moralis from "moralis";
import SpotEcosystem from "./components/pages/SpotEcosystem";

function App() {
  
  const  { isWeb3Enabled, isWeb3EnableLoading, enableWeb3, isAuthenticated, account } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const { switchNetwork, chainId, chain } = useChain();

  async function checkMetamask() {
    const isMetaMaskInstalled = await Moralis.isMetaMaskInstalled()
    if(!isMetaMaskInstalled) {
      alert("Metamask Wallet not found! Please install Metamask for your browser here: https://metamask.io/download/")
    }
  }
  
  useEffect(() => {
    checkMetamask()
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading){
        enableWeb3({ provider: connectorId });}
        (chainId !== '0xa86a')&&switchNetwork("0xa86a")
  }, [isAuthenticated, isWeb3Enabled, chain]);

    if (!isAuthenticated || account===null) {
      
      return (
        <Authenticate />
      );
    }
  
    return (
      <div className='App bg-slate-900'>
      <Router>
      <div className="bg-slate-900 w-full h-100">
      <Nav />
      <div className="flex justify-center items-center gap-2">
      <Routes>
          <Route path="/" exact element={<Board />} />
          <Route path="/Home" exact element={<Board />} />
          <Route path="/roadmap" exact element={<Roadmap />} />
          <Route path="/team" exact element={<Team />} />
          <Route path="/ecosystem" exact element={<SpotEcosystem />} />
        </Routes>
      </div>
      
      </div>
  

        <div className='footer'>
        <Footer />
        </div>
        
      </Router> 
      </div>
      
    );
  }

export default App;

