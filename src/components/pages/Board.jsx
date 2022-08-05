import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
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
    const spotTraitsContract = "0x6BDAd2A83a8e70F459786a96a0a9159574685c0e";
    const spotNFTContract = '0x9455aa2aF62B529E49fBFE9D10d67990C0140AFC';

    const [filter, setFilter] = useState('');
    const [textinput, setTextinput] = useState('');
    const [xInput, setXInput] = useState('125');
    const [yInput, setYInput] = useState('135');
    const [fontSize, setFontSize] = useState('30');
    const [font, setFont] = useState('Arial');
    const [fontStyle, setFontStyle] = useState('normal');

    const textinputUser = (event) => {
        setTextinput(event.target.value);
    }
    const userXInput = (event) => {
        setXInput(event.target.value);
    }
    const userYInput = (event) => {
        setYInput(event.target.value);
    }
    const userFontSize = (event) => {
        setFontSize(event.target.value);
    }

    const textFontOptions = [
        { value: "Arial", label: "Arial" },
        { value: "Comic Sans MS", label: "Comic Sans MS" },
        { value: "Courier New", label: "Courier New" },
        { value: "Times New Roman", label: "Times New Roman" },
        { value: "Fantasy", label: "Fantasy" },
        { value: "Sans-serif", label: "Sans-serif" },
        { value: "Serif", label: "Serif" },
        { value: "Cambria", label: "Cambria" },

    ];

    const textFontStyleOptions = [
        { value: "normal", label: "Normal" },
        { value: "bold", label: "Bold" },


    ];

    const handleChange = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFont(selectedOption.value);
    };

    const handleChangeStyle = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontStyle(selectedOption.value);
    };


    const [textinputText, setTextinputText] = useState('');
    const [xInputText, setXInputText] = useState('110');
    const [yInputText, setYInputText] = useState('160');
    const [fontSizeText, setFontSizeText] = useState('20');
    const [fontText, setFontText] = useState('Arial');
    const [fontStyleText, setFontStyleText] = useState('normal');


    const textinputUserText = (event) => {
        setTextinputText(event.target.value);
    }
    const userXInputText = (event) => {
        setXInputText(event.target.value);
    }
    const userYInputText = (event) => {
        setYInputText(event.target.value);
    }
    const userFontSizeText = (event) => {
        setFontSizeText(event.target.value);
    }

    const textFontOptionsText = [
        { value: "Arial", label: "Arial" },
        { value: "Comic Sans MS", label: "Comic Sans MS" },
        { value: "Courier New", label: "Courier New" },
        { value: "Times New Roman", label: "Times New Roman" },
        { value: "Fantasy", label: "Fantasy" },
        { value: "Sans-serif", label: "Sans-serif" },
        { value: "Serif", label: "Serif" },
        { value: "Cambria", label: "Cambria" },

    ];

    const textFontStyleOptionsText = [
        { value: "normal", label: "Normal" },
        { value: "bold", label: "Bold" },


    ];

    const handleChangeText = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontText(selectedOption.value);
    };

    const handleChangeStyleText = selectedOption => {
        console.log('handleChange', selectedOption.value);
        setFontStyleText(selectedOption.value);
    };

    {/* For Image retrieval */ }
    const [canvasImage, setCanvasImage] = useState({
        TombStone: '',
        Text: '',
    });
    {/* For Traits retrieval */ }
    const [chosenTrait, setChosenTrait] = useState({
        TombStone: '',
        TombStoneID: '1',
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
    const end = 3004;
    const branding = [...Array(end - start + 1).keys()].map(x => x + start);

    {/* For retrieval of traits */ }
    const [walletTraits, setWalletTraits] = useState([])
    const [apiLoaded, setApiLoaded] = useState(false)
    const [checkMyTraits, setCheckMyTraits] = useState(false)
    const unnamedNFTdata = unnamedData;

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

    function updateText() {
        drawImage(canvasImage.TombStone);
    }

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
            ctx.drawImage(img, 0, 0, width, height);
            ctx.font = `${fontStyle} ${fontSize}px ${font}`;
            ctx.fillText(textinput, xInput, yInput);
            ctx.font = `${fontStyleText} ${fontSizeText}px ${fontText}`;
            ctx.fillText(textinputText, xInputText, yInputText, 100);
        }

        const imgHidden = new Image();
        imgHidden.src = layer
        imgHidden.onload = () => {
            const ctxHidden = hiddenCanvas.current.getContext("2d")
            ctxHidden.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            ctxHidden.drawImage(imgHidden, 0, 0, 900, 900);
            ctxHidden.font = `${fontStyle} ${fontSize}px ${font}`;
            ctxHidden.fillText(textinput, xInput, yInput);
            ctxHidden.font = `${fontStyleText} ${fontSizeText}px ${fontText}`;
            ctxHidden.fillText(textinputText, xInputText, yInputText, 100);
        }

    }




    useEffect(() => {
        drawImage(canvasImage.TombStone);
        drawImage(canvasImage.Text);

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
                <div className="lg:sticky top-20 grid 2xl:grid-cols-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-1 ml-6 sm:p-5 bg-slate-900 lg:pb-3">
                    {/* canvas div */}

                    <div className="p-1 mb-10 sm:mb-10" ref={div} style={{ height: "20rem", width: "20rem" }}>
                        <canvas
                            ref={canvas}
                            width={width}
                            height={height}
                            className='mt-1 border-1 border-4 border-slate-500 text-center content-center p-5'
                        />
                        <div className="text-center md: pl-10"><h1 className='font-mono text-lg text-yellow-400 pt-1'>Gravedigger</h1></div>
                        <canvas
                            ref={hiddenCanvas}
                            width='900px'
                            height='900px'
                            className='hidden' />
                    </div>
                    {/* canvas div ends */}
                    {/* Stats div*/}
                    <div className='grow border-dashed border-4 border-slate-500 p-3 pl-5 m-1 text-left col-span-1 w-80 md:mt-10 lg:mt-2 mt-10 sm:mt-10 text-sm' style={{ height: "23rem" }}>
                        {/* Individual Stats */}
                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className={`text-${(walletTraits.includes(`${chosenTrait.TombStoneID}`)) ? "spot-yellow" : "[red]"} font-bold pr-3`}>TombStone: </div>
                            {chosenTrait.TombStoneID}
                        </div>


                        <div className='font-mono text-white list-none flex pb-3'>
                            <div className='text-spot-yellow'>Name: </div>
                            {textinput}
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
                            TombStone not in your wallet.
                        </div>
                        <div className="flex"> <button className="w-full m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={() => {
                                setOwnedCards(!ownedCards)
                            }}>{!ownedCards ? 'My TombStones' : 'View All TombStones'}</button></div>
                        {/*<div className='font-mono text-white list-none flex pb-3 text-sm'><span className={traitsAvailability === '0' ? "text-green-300" : "text-[#fa2121]"}>
                            {traitsAvailability === '0' && currentDNA.length >= 14 ? 'Trait Combo is Unique!' : null}
                            {traitsAvailability === '1' && currentDNA.length >= 14 ? "Trait Combo's Been Minted!" : null}</span>
                        </div>*/} {/* End of btm text lines */}
                    </div>{/* Stats div Ends*/}
                    {/* SearchBox */}
                    <div className="gap-4 pt-4 pl-2">
                        <div className="">
                            <div className='col-span-2 text-white'>Tomb Name: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="Engrave"
                                value={textinput}
                                onChange={textinputUser.bind(this)}
                            /></div>

                            <div className='col-span-2 text-white pt-2'>X coords: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="x plot"
                                value={xInput}
                                onChange={userXInput.bind(this)}
                            /></div>

                            <div className='col-span-1 text-white pt-2'>Y coords: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="y plot"
                                value={yInput}
                                onChange={userYInput.bind(this)}
                            /></div>

                            <div className='col-span-1 text-white pt-2'>Font Size: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="Font size"
                                value={fontSize}
                                onChange={userFontSize.bind(this)}
                            /></div></div>
                        <div className='flex justify-center pt-3 pb-2'>
                            <div className='col-span-1 w-38'><Select options={textFontOptions} onChange={handleChange} defaultValue={{ label: "Arial", value: "Arial" }} /></div>
                            <div className='col-span-1 w-38'><Select options={textFontStyleOptions} onChange={handleChangeStyle} defaultValue={{ label: "Normal", value: "normal" }} /></div>
                        </div>


                        {/*}   <div className='col-span-1'><input type="text"
                            className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2" placeholder="search trait/ID..."
                            value={filter}
                            onChange={searchText.bind(this)}
                        /></div>
                    */}

                        <div className='self-end'>
                            <button className="w-1/2 m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={updateCanvasTraits}>Refresh Text</button>

                        </div>
                    </div>{/* SearchBox Ends */}

                    <div className="gap-4 pt-4 pl-2">
                        <div className="">
                            <div className='col-span-2 text-white'>Epitaph: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="Engrave"
                                value={textinputText}
                                onChange={textinputUserText.bind(this)}
                            /></div>

                            <div className='col-span-2 text-white pt-2'>X coords: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="x plot"
                                value={xInputText}
                                onChange={userXInputText.bind(this)}
                            /></div>

                            <div className='col-span-1 text-white pt-2'>Y coords: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="y plot"
                                value={yInputText}
                                onChange={userYInputText.bind(this)}
                            /></div>

                            <div className='col-span-1 text-white pt-2'>Font Size: </div><div><input type="text"
                                className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2 w-24" placeholder="Font size"
                                value={fontSizeText}
                                onChange={userFontSizeText.bind(this)}
                            /></div></div>
                        <div className='flex justify-center pt-3 pb-2'>
                            <div className='col-span-1 w-38'><Select options={textFontOptionsText} onChange={handleChangeText} defaultValue={{ label: "Arial", value: "Arial" }} /></div>
                            <div className='col-span-1 w-38'><Select options={textFontStyleOptionsText} onChange={handleChangeStyleText} defaultValue={{ label: "Normal", value: "normal" }} /></div>
                        </div>


                        {/*}   <div className='col-span-1'><input type="text"
                            className="border-2 border-slate-600 bg-slate-400 text-left font-mono placeholder-slate-600 pl-2" placeholder="search trait/ID..."
                            value={filter}
                            onChange={searchText.bind(this)}
                        /></div>
                    */}

                        <div className='self-end'>
                            <button className="w-1/2 m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200
    hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base" onClick={updateCanvasTraits}>Refresh Text</button>

                        </div>
                    </div>


                </div>{/* Canvas Row Div Ends*/}
                <div className='overflow-y-auto'>
                    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-5 font-mono text-spot-yellow">
                        {ownedCards ? ownedFilter.map(createCard) : dataSearch.map(createCard)}
                    </div></div>
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