import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../Card';
import traits from '../../traits';
import metadata from '../../metadata.json'
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
    const spotTraitsContract = "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e";
    const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';

    const [filter, setFilter] = useState('');


    {/* For Image retrieval */ }
    const [canvasImage, setCanvasImage] = useState({
        UnnamedNFT: '',
        Branding: '',
    });
    {/* For Traits retrieval */ }
    const [chosenTrait, setChosenTrait] = useState({
        BackGround: '',
        Eyes: '',
        Mouth: '',
        Hat: '',
        Skin: '',
        Nose: '',
        Special: '',
        Lines: '',
        Branding: 'None',
        BrandingID: '9999'
    })

    //Set an array of save UnnamedNFT traits which are unburnable and available to all.
    const start = 3001;
    const end = 3002;
    const branding = [...Array(end - start + 1).keys()].map(x => x + start);

    {/* For retrieval of traits */ }
    const [walletTraits, setWalletTraits] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false)
    const [checkMyTraits, setCheckMyTraits] = useState(false)


    function getTraits() {
        const options = { chain: "0xa86a", address: userAddress, token_address: spotTraitsContract };
        Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
            const result = data.result
            setWalletTraits(result.map(nft => nft.token_id))
            setApiLoaded(true)

        });

    }


    useEffect(() => {
        getTraits();
    }, [account])

    function updateCanvasTraits(trait) {
        setCanvasImage(prevImage => ({ ...prevImage, [trait.traitType]: trait.image }))
        setChosenTrait(prevTrait => ({ ...prevTrait, [trait.traitType]: trait.traitName, [trait.traitType + 'ID']: trait.id }))
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
                /></div>
        )
    }

    // For Searching traits
    const searchText = (event) => {
        setFilter(event.target.value);
    }
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
            ctx.drawImage(img, 0, 0, width, height)
        }

        const imgHidden = new Image();
        imgHidden.src = layer
        imgHidden.onload = () => {
            const ctxHidden = hiddenCanvas.current.getContext("2d")
            ctxHidden.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            ctxHidden.drawImage(imgHidden, 0, 0, 900, 900)
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

    //Calling Traits Contract and PFP Contract using Moralis below.
    const currentDNA = "" + chosenTrait.BodyID + chosenTrait.HeadID + chosenTrait.EyesID + chosenTrait.MouthID + chosenTrait.BrandingID;
    const { data: traitData, error: traitError, fetch: traitFetch, isFetching: traitFetching, isLoading: traitLoading } = useWeb3ExecuteFunction({
        abi: spotNFTAbi,
        contractAddress: spotNFTContract,
        functionName: "checkDNA",
        params: {
            DNA: currentDNA,
        },
    });
    const { data: pfpData, error: pfpError, fetch: pfpFetch, isFetching: pfpFetching, isLoading: pfpLoading } = useWeb3ExecuteFunction({
        abi: spotTraitsAbi,
        contractAddress: spotTraitsContract,
        functionName: "checkDNA",
        params: {
            DNA: currentDNA,
        },
    });

    //Pass current DNA of selected traits in checkDNA function of NFT contract. Set Availability to 0 if available.
    const [traitsAvailability, setTraitsAvailability] = useState('1')
    useEffect(function () {
        if (currentDNA.length > 14) {
            traitFetch()
                .then((data) => setTraitsAvailability(JSON.stringify(data)))
        }
    }, [chosenTrait])

    // Add feature: Filter owned trait cards
    const [ownedCards, setOwnedCards] = useState(false)
    //---------------------------------//

    if (!isAuthenticated) {
        return (
            <Authenticate />
        );
    } else
        // Main Component Return
        return (
            <div className='container flex-auto mx-auto w-full'>

                {/* Canvas Row*/}
                <div className="lg:sticky top-20 grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                    {/* canvas div */}

                    <div className="p-1 mb-10 sm:mb-10" ref={div} style={{ height: "20rem", width: "20rem" }}>
                        <canvas
                            ref={canvas}
                            width={width}
                            height={height}
                            className='mt-1 border-1 border-4 border-slate-500 text-center content-center p-5'
                        />
                        <div className="text-center md: pl-10"><h1 className='font-mono text-lg text-yellow-400 pt-1'>Transmorphisizer</h1></div>
                        <canvas
                            ref={hiddenCanvas}
                            width='900px'
                            height='900px'
                            className='hidden' />
                    </div>
                    {/* canvas div ends */}
                    {/* Stats div*/}
                    <div className='grow border-dashed border-4 border-slate-500 p-3 m-1 text-left col-span-1 w-96 md:mt-10 lg:mt-1 mt-10 sm:mt-10 text-sm'>
                        {/* Individual Stats */}
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Background}`)) || (branding.some(ai => chosenTrait.Background === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>BackGround: </div>
                            {chosenTrait.BackGround}
                        </div>

                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Eyes}`)) || (branding.some(ai => chosenTrait.Eyes === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>Eyes: </div>
                            {chosenTrait.Eyes}
                        </div>
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Mouth}`)) || (branding.some(ai => chosenTrait.Mouth === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>Mouth: </div>
                            {chosenTrait.Mouth}
                        </div>
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Hat}`)) || (branding.some(ai => chosenTrait.Hat === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>Hat: </div>
                            {chosenTrait.Hat}
                        </div>
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Skin}`)) || (branding.some(ai => chosenTrait.Skin === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>Skin: </div>
                            {chosenTrait.Skin}
                        </div>
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Nose}`)) || (branding.some(ai => chosenTrait.Nose === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>Nose: </div>
                            {chosenTrait.Nose}
                        </div>
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Special}`)) || (branding.some(ai => chosenTrait.Special === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>Special: </div>
                            {chosenTrait.Special}
                        </div>
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.Lines}`)) || (branding.some(ai => chosenTrait.Lines === ai)) ? "spot-yellow" : "spot-yellow"} font-bold pr-3`}>Lines: </div>
                            {metadata.Lines}
                        </div>

                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${walletTraits.includes(`${chosenTrait.BrandingID}`) || (branding.some(ai => chosenTrait.BrandingID === ai)) ? "spot-yellow" : "[red]"} font-bold pr-3`}>Branding: </div>
                            {chosenTrait.Branding} (ID: {chosenTrait.BrandingID})
                        </div>
                        {/* End of Indiv Stats */}
                        {/* Buttons */}
                        <div className="pt-1 pb-1 flex">

                            <Mint
                                chosenTrait={chosenTrait}
                                walletTraits={walletTraits}
                                saveImage={saveImage}
                                userAddress={userAddress}
                                canvas={chosenTrait}
                                savedImage={savedImage}
                                branding={branding}
                            // traitsAvailability={traitsAvailability}
                            />
                            <button className="m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                                    setCheckMyTraits(!checkMyTraits)
                                }}>My Owned UnnamedNFT</button>

                        </div>
                        {/* End of Buttons */}
                        {/* Two bottom text lines */}

                        {/*check this*/}

                        {/*  <div className='font-mono text-white list-none flex pb-0 pt-3 text-sm'>
                            <div className='text-spot-yellow font-bold pr-3 text-xl'>* </div>
                            Traits in your wallet:  {apiLoaded, checkMyTraits && walletTraits.length + ' nos.'} {apiLoaded, checkMyTraits && 'IDs: ' + walletTraits.map(trait => ' ' + trait)}
                        </div>*/}
                        <div className='font-mono text-white list-none flex pb-3 text-sm'>
                            <div className='text-[red] pr-3 text-xl'>* </div>
                            UnnamedNFT not in your wallet.
                        </div>
                        {/*<div className='font-mono text-white list-none flex pb-3 text-sm'><span className={traitsAvailability === '0' ? "text-green-300" : "text-[#fa2121]"}>
                            {traitsAvailability === '0' && currentDNA.length >= 14 ? 'Trait Combo is Unique!' : null}
                            {traitsAvailability === '1' && currentDNA.length >= 14 ? "Trait Combo's Been Minted!" : null}</span>
                        </div>*/} {/* End of btm text lines */}
                    </div>{/* Stats div Ends*/}
                    {/* SearchBox */}
                    <div className="grid grid-rows-1 grid-cols-1 gap-4 pt-10 pl-10 self-end">
                        <div className='col-span-1'><input type="text"
                            className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2" placeholder="search trait/ID..."
                            value={filter}
                            onChange={searchText.bind(this)}
                        /></div>

                        <div className='self-end'>
                            <button className="w-1/2 m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                                    setOwnedCards(!ownedCards)
                                }}>{!ownedCards ? 'My UnnamedNFTs' : 'All UnnamedNFTs'}</button></div>
                    </div>{/* SearchBox Ends */}

                </div>{/* Canvas Row Div Ends*/}
                <div className='overflow-y-auto'>
                    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                        {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                    </div></div>
            </div>
        )
}