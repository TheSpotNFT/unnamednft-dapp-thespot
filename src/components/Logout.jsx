import React from "react";
import { useMoralis } from "react-moralis";
//import Authenticate from "./Authenticate";
import { useChain } from "react-moralis";



function LogoutButton() {
    const { logout, isAuthenticating, account } = useMoralis();
    const { switchNetwork, chainId } = useChain();
  
    if(account===null) {
      return(
        <div className="text-right md:flex align-middle py-0">
    <div className="align-middle py-2">
    <h1 className="text-slate-600 text-right font-mono px-10 py-0"><b>Disconnected All Accounts!</b></h1>
    </div>  
      </div>
      )
    }
    return (
    <div className="text-right md:flex align-middle py-0">
    <div className="align-middle py-2">
    <h1 className="text-slate-600 text-right font-mono px-10 py-0"><b>Wallet:</b> {(chainId==="0xa86a")?account.substring(0,5)+'...'+account.slice(-4):<button className="text-[red]" onClick={()=>switchNetwork("0xa86a")}>Switch to Avalanche!</button>}</h1>
    </div>  
        <button className="rounded-lg px-4 py-0 border-4 border-white text-xl font-mono font-bold text-slate-700 
        hover:bg-white hover:border-black hover:text-gray-900 duration-300" isloading={isAuthenticating} onClick={() => logout()} disabled={isAuthenticating}>
            Logout
        </button> 
      </div>
    );
  };

  export default LogoutButton;