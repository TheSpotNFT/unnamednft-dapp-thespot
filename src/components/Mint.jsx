import { stringify } from 'postcss';
import React, { useEffect, useState } from 'react'
import { useWeb3ExecuteFunction, useMoralisCloudFunction } from "react-moralis";
import unnamedNFTBrandingAbi from '../contracts/spotNFTAbi.json';
import Moralis from 'moralis';
import unnamedData from '../metadata';




function Mint(props) {
  const [isLoading, setIsLoading] = useState(false)
  const unnamedNFTBrandingContract = "0xbb8e5cFe864015239C762C0Ae3A59CeadB3090fE";
  const unnamedNFTContract = '0x6BDAd2A83a8e70F459786a96a0a9159574685c0e';
  const unnamedNFTdata = unnamedData;
  const chosenTrait = useState();
  const chosenBrand = useState();

  let userAddress = props.userAddress

  const { data: mintData, error: mintError, fetch: mintFetch, isFetching: mintFetching, isLoading: mintLoading } = useWeb3ExecuteFunction();

  function getImage() {
    return props.saveImage()
  }

  /*function checkTraits() {
    let isSafeBG = props.solidBG.some(ai => props.chosenTrait.BackgroundID === ai)
    if ((props.walletTraits.includes(String(props.chosenTrait.BackgroundID)) || isSafeBG) && props.walletTraits.includes(String(props.chosenTrait.BodyID)) && props.walletTraits.includes(String(props.chosenTrait.HeadID)) &&
      props.walletTraits.includes(String(props.chosenTrait.MouthID)) && props.walletTraits.includes(String(props.chosenTrait.EyesID)) && (props.walletTraits.includes(String(props.chosenTrait.HeadwearID)) || props.chosenTrait.HeadwearID === '599')) {
      return true;
    } else return false;
  }*/

  async function mintMyNFT() {

    setIsLoading(true)
    const base64 = await getImage()
    const imageData = new Moralis.File("img.png", { base64: base64 });
    await imageData.saveIPFS();
    const imgURL = await imageData.ipfs();


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
    const tokenMetadataUrlResult = await Moralis.Cloud.run("handlemint", {
      metadata
    });
    const mintResult = await mintFetch({
      params: {
        abi: unnamedNFTBrandingAbi,
        contractAddress: unnamedNFTBrandingContract,
        functionName: "mint",
        params: {
          uri: tokenMetadataUrlResult,
        },
        msgValue: Moralis.Units.ETH(0.2),
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
      <div>
        <button className="m-1 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={mintMyNFT}>Mint (0.2)</button>
      </div>
    )
}

export default Mint;
