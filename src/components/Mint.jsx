import { stringify } from 'postcss';
import React, { useEffect, useState } from 'react'
import { useWeb3ExecuteFunction, useMoralisCloudFunction } from "react-moralis";
import spotNFTAbi from '../contracts/spotNFTAbi.json';
import Moralis from 'moralis';
import unnamedData from '../metadata';



function Mint(props) {
  const [isLoading, setIsLoading] = useState(false)
  const spotTraitsContract = "0x9521807adf320d1cdf87afdf875bf438d1d92d87";
  const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';
  const background = props.chosenTrait.background;
  const lines = props.chosenTrait.text;


  let userAddress = props.userAddress

  const { data: mintData, error: mintError, fetch: mintFetch, isFetching: mintFetching, isLoading: mintLoading } = useWeb3ExecuteFunction();

  function getImage() {
    return props.saveImage()
  }

  function checkTraits() {
    let isSafeBG = props.solidBG.some(ai => props.chosenTrait.BackgroundID === ai)
    if ((props.walletTraits.includes(String(props.chosenTrait.BackgroundID)) || isSafeBG) && props.walletTraits.includes(String(props.chosenTrait.BodyID)) && props.walletTraits.includes(String(props.chosenTrait.HeadID)) &&
      props.walletTraits.includes(String(props.chosenTrait.MouthID)) && props.walletTraits.includes(String(props.chosenTrait.EyesID)) && (props.walletTraits.includes(String(props.chosenTrait.HeadwearID)) || props.chosenTrait.HeadwearID === '599')) {
      return true;
    } else return false;
  }

  async function mintMyNFT() {
    if (!checkTraits()) {
      alert("Some of the selected traits are not in your wallet. Ensure all trait-titles are yellow. Click 'My Owned Traits' again to refresh wallet traits.")
    }

    else {
      setIsLoading(true)
      const base64 = await getImage()
      const imageData = new Moralis.File("img.png", { base64: base64 });
      await imageData.saveIPFS();
      const imgURL = await imageData.ipfs();

      const metadata = {
        "name": "Tombstones",
        "description": "Your TombStone",
        "image": imgURL,
        "attributes": [
          {
            "trait_type": "Tombstone",
            "value": background
          },
          {
            "trait_type": "Name",
            "value": "name"
          }
        ],
      }
      const tokenMetadataUrlResult = await Moralis.Cloud.run("handlemint", {
        metadata
      });
      const mintResult = await mintFetch({
        params: {
          abi: spotNFTAbi,
          contractAddress: spotNFTContract,
          functionName: "mint",
          params: {
            bg: props.chosenTrait.BackgroundID,
            body: props.chosenTrait.BodyID,
            head: props.chosenTrait.HeadID,
            eyes: props.chosenTrait.EyesID,
            mouth: props.chosenTrait.MouthID,
            headwear: props.chosenTrait.HeadwearID,
            uri: tokenMetadataUrlResult,
          },
          msgValue: Moralis.Units.ETH(0.3),
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
  }
  if (isLoading) {
    return (
      <div><button className="inline-flex m-2 rounded-lg px-4 py-2 border-2 border-spot-yellow text-spot-yellow
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
        <button className="m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
     hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={mintMyNFT} disabled={props.traitsAvailability === '1'}>Mint (0.1)</button>
      </div>
    )
}

export default Mint;
