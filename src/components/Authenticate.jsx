import React from 'react';
import { useMoralis } from 'react-moralis'
import goatdLogo from "../assets/goatd.png"

export default function Authenticate() {
    const  { authenticate } = useMoralis();
  return (
    <div className="bg-slate-900 flex w-full h-screen align-middle">
    <div className="m-auto">
    <img src={goatdLogo} className="max-w-md" alt="Goatd Logo"></img>
    <div className="align-middle px-40 py-10">
    <button className="align-middle rounded-lg px-4 py-2 border-4 border-spot-yellow text-spot-yellow 
    hover:bg-spot-yellow hover:text-black duration-300 hover:border-white font-mono text-l" onClick={() => authenticate({ signingMessage: "Sign in to The Spot!" })}><b>Authenticate</b></button>
    </div>
    </div>
      </div>
  )
}
