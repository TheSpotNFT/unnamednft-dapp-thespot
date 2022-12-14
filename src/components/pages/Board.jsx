import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../Card';
import traits from '../../traits';
import unnamedData from '../../metadata.jsx'
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import Moralis from 'moralis';
import Authenticate from '../Authenticate';
import spotNFTAbi from '../../contracts/spotNFTAbi.json';
import spotTraitsAbi from '../../contracts/spotTraitsAbi.json';
import SetApproval from '../SetApproval';
import Mint from '../Mint';

export const Board = () => {
    const { account, isAuthenticated } = useMoralis();
    const userAddress = account
    const unnamedNFTContract = "0x6bdad2a83a8e70f459786a96a0a9159574685c0e";
    const spotNFTContract = '0x0C6945E825fc3c80F0a1eA1d3E24d6854F7460d8';
    const [filter, setFilter] = useState('');
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        });
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    };
    //For Metadata
    const [unnamedBackGround, setUnnamedBackGround] = useState();
    const [unnamedEyes, setUnnamedEyes] = useState();
    const [unnamedMouth, setUnnamedMouth] = useState();
    const [unnamedHat, setUnnamedHat] = useState();
    const [unnamedSkin, setUnnamedSkin] = useState();
    const [unnamedNose, setUnnamedNose] = useState();
    const [unnamedSpecial, setUnnamedSpecial] = useState();
    const [unnamedLines, setUnnamedLines] = useState();
    const [unnamedBrand, setUnnamedBrand] = useState();
    const [unnamedID, setUnnamedID] = useState();


    {/* For Image retrieval */ }
    const [canvasImage, setCanvasImage] = useState({
        UnnamedNFT: '',
        Branding: '',
    });
    {/* For Traits retrieval */ }
    const [chosenTrait, setChosenTrait] = useState({
        UnnamedNFT: '',
        UnnamedNFTID: '1',
        Eyes: '',
        Mouth: '',
        Hat: '',
        Skin: '',
        Nose: '',
        Special: '',
        Lines: '',

    })

    const [chosenBrand, setChosenBrand] = useState({
        Branding: '',
        BrandingID: ''
    })


    //Set an array of save UnnamedNFT traits which are unburnable and available to all.
    const start = 3001;
    const end = 3099;
    const branding = [...Array(end - start + 1).keys()].map(x => x + start);

    {/* For retrieval of traits */ }
    const [walletTraits, setWalletTraits] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false)
    const [checkMyTraits, setCheckMyTraits] = useState(false)
    const unnamedNFTdata = unnamedData;
    //mainnet chain 0xa86a
    //testnet chain 0xa869
    function getNFTs() {
        const options = { chain: "0xa86a", address: userAddress, token_address: unnamedNFTContract };
        Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
            const result = data.result
            setWalletTraits(result.map(nft => nft.token_id))
            setApiLoaded(true)

        });
        // 0xa869
    }


    useEffect(() => {
        getNFTs();
    }, [account])

    useEffect(() => {
        updateTraitMetaData();
    }, [chosenTrait])


    async function updateCanvasTraits(trait) {
        setCanvasImage(prevImage => ({ ...prevImage, [trait.traitType]: trait.image }))
        setChosenTrait(prevTrait => ({ ...prevTrait, [trait.traitType]: trait.traitName, [trait.traitType + 'ID']: trait.id }))
        setChosenBrand(prevBrand => ({ ...prevBrand, [trait.traitType]: trait.brand }))


    }

    function updateTraitMetaData() {
        setUnnamedBackGround(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[0].value);
        setUnnamedEyes(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[1].value);
        setUnnamedMouth(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[2].value);
        setUnnamedHat(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[3].value);
        setUnnamedSkin(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[4].value);
        setUnnamedNose(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[5].value);
        setUnnamedSpecial(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[6].value);
        setUnnamedLines(unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[7].value);
        setUnnamedBrand(chosenBrand.Branding);
        setUnnamedID(chosenTrait.UnnamedNFTID)
    }




    function createCard(trait) { //Building the card here from Card.jsx passing props and simultaneously fetching traits on click.
        return (

            <div key={trait.edition} onClick={() => {
                updateCanvasTraits(trait)

            }}> <Card
                    nftName={trait.nftName}
                    traitType={trait.traitType}
                    traitName={trait.traitName}
                    image={trait.image}
                    id={trait.id}
                    brand={trait.brand}
                /></div>
        )
    }

    /* For Searching traits
    const searchText = (event) => {
        setFilter(event.target.value);
    }
    */

    let dataSearch = traits.filter(item => {
        return Object.keys(item).some(key => item[key].toString().toLowerCase().includes(filter.toString().toLowerCase())
        )
    });
    let ownedFilter = traits.filter(item => {

        if (walletTraits.includes(item.id.toString()) || branding.includes(item.id)) {

            return item
        }

    })

    // Putting stuff on Canvas
    const canvas = useRef(null)
    const hiddenCanvas = useRef(null)
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const { windowWidth } = useState(window.innerWidth)
    const { windowHeight } = useState(window.innerHeight)

    const div = useCallback(node => {

        if (node !== null) {

            setHeight(node.getBoundingClientRect().height); //set height and width of canvas relative to parent div.
            setWidth(node.getBoundingClientRect().width);
        }
    }, [windowWidth, windowHeight]);

    function drawImage(layer) {
        const img = new Image();
        //img.setAttribute('crossOrigin', '*');
        img.src = layer
        img.onload = () => {
            const ctx = canvas.current.getContext("2d")
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);
        }

        const imgHidden = new Image();
        imgHidden.src = layer
        imgHidden.onload = () => {
            const ctxHidden = hiddenCanvas.current.getContext("2d")
            ctxHidden.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            ctxHidden.drawImage(imgHidden, 0, 0, 512, 512);
        }

    }




    useEffect(() => {
        drawImage(canvasImage.UnnamedNFT);
        drawImage(canvasImage.Branding);


    }
        , [canvasImage, canvas, windowWidth, windowHeight])
    const [savedImage, setSavedImage] = useState('empty image') //Saving image for sending to IPFS. This part isn't active yet!
    function saveImage() {
        const result = (new Promise((resolve, reject) => {
            const imageToSave = new Image();
            imageToSave.src = hiddenCanvas.current.toDataURL('image/png', 1.0);
            imageToSave.onload = function () {
                resolve(this.src);
            };
        }));

        return result;
    }




    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(true)
    //---------------------------------//

    //filtering


    if (!isAuthenticated) {
        return (
            <Authenticate />
        );
    } else
        // Main Component Return
        return (
            <div className='container flex-auto mx-auto w-full'>

                {/* Canvas Row*/}
                <div className="lg:sticky top-20 grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                    {/* canvas div */}

                    <div className="p-1 mb-10 sm:mb-10" ref={div} style={{ height: "23rem", width: "23rem" }}>
                        <canvas
                            ref={canvas}
                            width={width}
                            height={height}
                            className='mt-1 border-1 border-4 border-slate-500 text-center content-center p-5'
                        />
                        <div className="text-center md: pl-10"><h1 className='font-mono text-lg text-yellow-400 pt-1'>Branding</h1></div>
                        <canvas
                            ref={hiddenCanvas}
                            width='512px'
                            height='512px'
                            className='hidden' />
                    </div>
                    {/* canvas div ends */}
                    {/* Stats div*/}
                    <div className='grow border-dashed border-4 border-slate-500 p-3 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm' style={{ height: "26rem", width: "23rem" }}>
                        {/* Individual Stats */}
                        <div className='font-mono text-white list-none flex'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.UnnamedNFTID}`)) ? "spot-yellow" : "[red]"} font-bold pr-3 pl-2`}>UnnamedNFT: </div>
                            {chosenTrait.UnnamedNFTID}
                        </div>

                        <div className="text-spot-yellow flex pl-2">BackGround: <div className='text-white flex px-2'>{unnamedBackGround}</div></div>
                        <div className="text-spot-yellow flex pl-2">Eyes: <div className='text-white flex px-2'>{unnamedEyes}</div></div>
                        <div className="text-spot-yellow flex pl-2">Mouth: <div className='text-white flex px-2'>{unnamedMouth}</div></div>
                        <div className="text-spot-yellow flex pl-2">Hat: <div className='text-white flex px-2'>{unnamedHat}</div></div>
                        <div className="text-spot-yellow flex pl-2">Skin: <div className='text-white flex px-2'>{unnamedSkin}</div></div>
                        <div className="text-spot-yellow flex pl-2">Nose: <div className='text-white flex px-2'>{unnamedNose}</div></div>
                        <div className="text-spot-yellow flex pl-2">Special: <div className='text-white flex px-2'>{unnamedSpecial}</div></div>
                        <div className="text-spot-yellow flex pl-2">Lines: <div className='text-white flex px-2'>{unnamedLines}</div></div>
                        <div className="text-spot-yellow flex pl-2">Brand: <div className='text-white flex px-2'>{chosenBrand.Branding}</div></div>
                        {/* End of Indiv Stats */}
                        {/* Buttons */}
                        <div className="pt-1 pb-1 pr-2 pl-1 flex">

                            <Mint
                                chosenTrait={chosenTrait}
                                walletTraits={walletTraits}
                                unnamedBackGround={unnamedBackGround}
                                unnamedBrand={unnamedBrand}
                                unnamedEyes={unnamedEyes}
                                unnamedMouth={unnamedMouth}
                                unnamedHat={unnamedHat}
                                unnamedSkin={unnamedSkin}
                                unnamedNose={unnamedNose}
                                unnamedSpecial={unnamedSpecial}
                                unnamedLines={unnamedLines}
                                unnamedID={unnamedID}
                                saveImage={saveImage}
                                userAddress={userAddress}
                                canvas={chosenTrait}
                                savedImage={savedImage}
                            // branding={branding}
                            // traitsAvailability={traitsAvailability}
                            />


                        </div>
                        {/* End of Buttons */}
                        {/* Two bottom text lines */}

                        {/*check this*/}

                        {/*  <div className='font-mono text-white list-none flex pb-0 pt-3 text-sm'>
                            <div className='text-spot-yellow font-bold pr-3 text-xl'>* </div>
                            Traits in your wallet:  {apiLoaded, checkMyTraits && walletTraits.length + ' nos.'} {apiLoaded, checkMyTraits && 'IDs: ' + walletTraits.map(trait => ' ' + trait)}
                        </div>*/}
                        <div className='font-mono text-white list-none flex text-sm pl-2'>
                            You must approve your unnamedNFT to be burnt before minting
                            <div className='text-[red] pr-3 text-xl'>* </div>
                            UnnamedNFT not in your wallet.
                        </div>
                        <div className="flex pr-2 pl-2 pt-2"> <button className="w-full rounded-lg px-1 py-1 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                                setOwnedCards(!ownedCards)
                            }}>{!ownedCards ? 'My UnnamedNFTs' : 'View All UnnamedNFTs'}</button></div>
                        {/*<div className='font-mono text-white list-none flex pb-3 text-sm'><span className={traitsAvailability === '0' ? "text-green-300" : "text-[#fa2121]"}>
                            {traitsAvailability === '0' && currentDNA.length >= 14 ? 'Trait Combo is Unique!' : null}
                            {traitsAvailability === '1' && currentDNA.length >= 14 ? "Trait Combo's Been Minted!" : null}</span>
                        </div>*/} {/* End of btm text lines */}
                    </div>{/* Stats div Ends*/}
                    {/* SearchBox */}
                    {/*}<div className="gap-4 pt-4 pl-2">



                           <div className='col-span-1'><input type="text"
                            className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2" placeholder="search trait/ID..."
                            value={filter}
                            onChange={searchText.bind(this)}
                        /></div>
                    


                    </div>*/}{/* SearchBox Ends */}




                </div>{/* Canvas Row Div Ends*/}
                <div className='overflow-y-auto'>
                    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                        {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                    </div></div>
                <div>
                    {showButton && (
                        <button onClick={scrollToTop} className="back-to-top">
                            &#94;
                        </button>
                    )}
                </div>
                {/*} <div className="text-white">BackGround: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[0].value}</div>
                <div className="text-white">Eyes: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[1].value}</div>
                <div className="text-white">Mouth: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[2].value}</div>
                <div className="text-white">Hat: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[3].value}</div>
                <div className="text-white">Skin: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[4].value}</div>
                <div className="text-white">Nose: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[5].value}</div>
                <div className="text-white">Special: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[6].value}</div>
                <div className="text-white">Lines: {unnamedData[`${(chosenTrait.UnnamedNFTID - 1)}`].attributes[7].value}</div>

                            */}
            </div>

        )

}
/*


let ownedFilter = traits.filter(item => {

        if (walletTraits.includes(item.id.toString()) || branding.includes(item.id)) {

            return item
        }

    })
    */