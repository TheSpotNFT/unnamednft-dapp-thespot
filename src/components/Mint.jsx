import { stringify } from 'postcss';
import React, { useEffect, useState } from 'react'
import { useWeb3ExecuteFunction, useMoralisCloudFunction, useMoralis } from "react-moralis";
import unnamedNFTBrandingAbi from '../contracts/unnamedbrandingABI.json';
import Moralis from 'moralis';
import unnamedData from '../metadata';
import unnamedAbi from '../contracts/unnamedABI.json';





function Mint(props) {
  const { account, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(false)
  const unnamedNFTBrandingContract = "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5"; //unnamedbranding mainnet contract
  const unnamedNFTContract = '0x6BDAd2A83a8e70F459786a96a0a9159574685c0e'; //unnamed mainnet contract
  const unnamedNFTdata = unnamedData;
  const spotContract = '0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8' //thespot mainnet
  const chosenTrait = useState();
  const chosenBrand = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  const [isApproved, setIsApproved] = useState();




  let userAddress = props.userAddress

  const { data: mintData, error: mintError, fetch: mintFetch, isFetching: mintFetching, isLoading: mintLoading } = useWeb3ExecuteFunction();

  function getImage() {
    return props.saveImage()
  }

  async function isApprovedForAll() {
    const approvedForAll = {
      chain: "avalanche",
      address: "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e",
      function_name: "isApprovedForAll",
      abi: unnamedAbi,
      params: {
        owner: userAddress,
        operator: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5"
      },
    };
    const areYouApproved = await Moralis.Web3API.native.runContractFunction(
      approvedForAll
    );
    setIsApproved(areYouApproved);


    /*await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e", //unnamed mainnet
      functionName: "isApprovedForAll",
      abi: unnamedAbi,
  
      params: {
        owner: userAddress,
        operator: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5",
      },
    };
    await Moralis.executeFunction(sendOptions);
  
    // setIsApproved(true);*/
  }
  useEffect(() => {
    isApprovedForAll();
  }, []);

  console.log(isApproved, userAddress)



  /*function checkApproval() {
    if (isApproved === false) {
      setIsApproved(false);
    }
    else setIsApproved(true)
  }
  */
  async function mintMyNFT() {

    setIsLoading(true)
    const base64 = await getImage()
    const imageData = new Moralis.File("img.png", { base64: base64 });
    await imageData.saveIPFS();
    const imgURL = await imageData.ipfs();
    console.log(imgURL)

    const metadata = {
      "name": "Branded",
      "description": "Branded UnnamedNFT",
      "image": imgURL,
      "attributes": [
        {
          "trait_type": "Eyes:",
          "value": props.unnamedEyes
        },
        {
          "trait_type": "Mouth",
          "value": props.unnamedMouth
        },
        {
          "trait_type": "Hat",
          "value": props.unnamedHat
        },
        {
          "trait_type": "Skin",
          "value": props.unnamedSkin
        },
        {
          "trait_type": "Nose",
          "value": props.unnamedNose
        },
        {
          "trait_type": "Special",
          "value": props.unnamedSpecial
        },
        {
          "trait_type": "Lines",
          "value": props.unnamedLines
        },
        {
          "trait_type": "Brand",
          "value": props.unnamedBrand
        },

      ],
    }
    console.log(metadata)
    console.log(props.unnamedBrand)

    const metaDataFile = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
    await metaDataFile.saveIPFS();
    const metaDataUrl = await metaDataFile.ipfs();
    console.log(metaDataUrl)
    console.log(props.unnamedID)
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5", //unnamedbranding mainnet
      functionName: "mint",
      abi: unnamedNFTBrandingAbi,
      msgValue: Moralis.Units.ETH(0.2),
      params: {
        unnamedId: props.unnamedID,
        uri: metaDataUrl,
      },
    };
    const transaction = await Moralis.executeFunction(sendOptions);
    await transaction.wait()
    alert(`Minted Successfully! Txn Hash: ${transaction.hash}`)



    const mintResult = await mintFetch({
      params: {
        abi: unnamedNFTBrandingAbi,
        contractAddress: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5",
        functionName: "mint",
        params: {
          unnamedId: props.unnamedID,
          uri: metaDataUrl,
        },
      },
      onError: (err) => {
        setIsLoading(false)
        alert(JSON.stringify(err.data.message));


      },
      onSuccess: (tx) => {
        tx.wait(2).then(alert("Minted successfully! View your NFT on Kalao or Campfire!"))
          .then(setIsLoading(false))
          .then(console.log(tx))
      }
    });

  }
  async function spotMintMyNFT() {

    setIsLoading(true)
    const base64 = await getImage()
    const imageData = new Moralis.File("img.png", { base64: base64 });
    await imageData.saveIPFS();
    const imgURL = await imageData.ipfs();
    console.log(imgURL)

    const metadata = {
      "name": "Branded",
      "description": "Branded UnnamedNFT",
      "image": imgURL,
      "attributes": [
        {
          "trait_type": "Eyes:",
          "value": props.unnamedEyes
        },
        {
          "trait_type": "Mouth",
          "value": props.unnamedMouth
        },
        {
          "trait_type": "Hat",
          "value": props.unnamedHat
        },
        {
          "trait_type": "Skin",
          "value": props.unnamedSkin
        },
        {
          "trait_type": "Nose",
          "value": props.unnamedNose
        },
        {
          "trait_type": "Special",
          "value": props.unnamedSpecial
        },
        {
          "trait_type": "Lines",
          "value": props.unnamedLines
        },
        {
          "trait_type": "Brand",
          "value": props.unnamedBrand
        },

      ],
    }
    console.log(metadata)
    console.log(props.unnamedBrand)

    const metaDataFile = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
    await metaDataFile.saveIPFS();
    const metaDataUrl = await metaDataFile.ipfs();
    console.log(metaDataUrl)
    console.log(props.unnamedID)
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5", //unnamedbranding fuji
      functionName: "mint",
      abi: unnamedNFTBrandingAbi,
      msgValue: Moralis.Units.ETH(0),
      params: {
        unnamedId: props.unnamedID,
        uri: metaDataUrl,
      },
    };
    const transaction = await Moralis.executeFunction(sendOptions);
    await transaction.wait()
    alert(`Minted Successfully! Txn Hash: ${transaction.hash}`)



    const mintResult = await mintFetch({
      params: {
        abi: unnamedNFTBrandingAbi,
        contractAddress: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5",
        functionName: "mint",
        params: {
          uri: metaDataUrl,
        },
      },
      onError: (err) => {
        setIsLoading(false)
        alert(JSON.stringify(err.data.message));


      },
      onSuccess: (tx) => {
        tx.wait(2).then(alert("Minted successfully! View your NFT on Kalao or Campfire!"))
          .then(setIsLoading(false))
          .then(console.log(tx))
      }
    });

  }

  /*useEffect(() => {
    checkApproval();
   
  }, [])
  */
  async function setApproval() {
    await Moralis.enableWeb3();
    const options = {
      contractAddress: "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e", //unnamedNFT mainnet
      functionName: "setApprovalForAll",
      abi: unnamedAbi,
      params: {
        operator: "0xB043aaEb4337EA4BbB20C2ec5D846b00a0825ba5", //branding mainnet
        approved: "1",
      },
    };
    await contractProcessor.fetch({
      params: options,
    });
    const transaction = await Moralis.executeFunction(options);
    await transaction.wait()
    isApprovedForAll();
  }

  if (isLoading) {
    return (
      <div><button className="inline-flex m-1 rounded-lg px-4 py-2 border-2 border-spot-yellow text-spot-yellow
     duration-300 font-mono font-bold text-base" disabled>
        <svg className="inline animate-ping h-5 w-5 mr-3" viewBox="0 0 35 35">
          <circle className="path" cx="12" cy="15" r="10" fill="yellow" stroke="yellow" strokeWidth="2"></circle>
        </svg>
        Processing...
      </button>
      </div>
    )
  } else
    return (

      <div className="flex">
        <div className={isApproved ? "hidden" : "flex"}>
          <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={setApproval}>Approve Unnamed</button>
        </div>
        <div className={isApproved ? "flex" : "hidden"}>
          <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={mintMyNFT}>Mint (0.2)</button>

          <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={spotMintMyNFT}>Spot Holder Mint (0)</button>
        </div>




      </div>


    )
}

export default Mint;


{/*
      <div className="flex">
        <div className={isApproved ? "flex" : "hidden"}>
          <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={mintMyNFT}>Mint (0.2)</button>

          <button className="m-1 rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={spotMintMyNFT}>Spot Holder Mint (0)</button>
        </div>

        <div className={isApproved ? "hidden" : "flex"}>
          <button className="m-1 w-max rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={setApproval}>Approve</button>
        </div>
    </div>*/}