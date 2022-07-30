import React from 'react'

export default function Roadmap() {
  return (
    <div className='text-white h-full'>
    {/* Tailblocks Theme */}
    
    <section className="text-gray-400 body-font  font-mono">
  <div className="container px-5 py-10 mx-auto flex flex-col">
    <div className="lg:w-4/6 mx-auto">
      <div className="lg:text-left sm:text-center">
        <h1 className='text-5xl  font-mono uppercase text-yellow-400 mt-10 pt-10 pb-10 lg:text-left sm:text-center'>Roadmap</h1>
      </div>
      {/* Q1 */}
      <div className="flex flex-col sm:flex-row mt-10">
        <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
          <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
            <h1 className='font-mono text-4xl'>Q1</h1>
          </div>
          <div className="flex flex-col items-center text-center justify-center">
            <h2 className="font-medium title-font mt-4 text-white text-lg">Year 2022</h2>
            <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
            <p className="text-yellow-400 text-lg font-bold">The Beginning!</p>
          </div>
        </div>
        <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left">
          <p className="leading-relaxed text-xl text-justify mb-4"><b>Traits</b> will be airdropped to holders of <b>The Spot NFTs</b>, The Spot's Artdrops and Spotdrops. 
            These traits are tradeable and sellable on NFTrade (and soon on Kalao)! Development of the transmorphisizer that will allow users to combine the traits to create a pfp.</p> 
        </div>
      </div>
    </div>
  </div>
</section>

{/* Q2 */}
<section className="text-gray-400 body-font  font-mono">
<div className="container px-5 py-10 mx-auto flex flex-col">
    <div className="lg:w-4/6 mx-auto">
      <div className="flex flex-col sm:flex-row mt-1">
        <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
          <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
            <h1 className='font-mono text-4xl'>Q2</h1>
          </div>
          <div className="flex flex-col items-center text-center justify-center">
            <h2 className="font-medium title-font mt-4 text-white text-lg">Year 2022</h2>
            <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
            <p className="text-yellow-400 text-lg font-bold">The Mint!</p>
          </div>
        </div>
        <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left">
          <p className="leading-relaxed text-xl mb-4 text-justify">Activate the transmorphisizer. Users can combine traits and mint <b>The Spot's</b> Goatd pfp!
              Continue to expand the Goatd pfp trait library and airdrop traits to <b>The Spot</b> holders. Secondary marketplace listings to go live.</p> 
        </div>
      </div>
    </div>
  </div>
</section>

{/* Q3 */}
<section className="text-gray-400 body-font  font-mono">
<div className="container px-5 py-10 mx-auto flex flex-col">
    <div className="lg:w-4/6 mx-auto">
      <div className="flex flex-col sm:flex-row mt-1">
        <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
          <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-500 text-spot-yellow">
            <h1 className='font-mono text-4xl'>Q3</h1>
          </div>
          <div className="flex flex-col items-center text-center justify-center">
            <h2 className="font-medium title-font mt-4 text-white text-lg">Year 2022</h2>
            <div className="w-12 h-1 bg-spot-yellow rounded mt-2 mb-4"></div>
            <p className="text-yellow-400 text-lg font-bold">The Second Coming!</p>
          </div>
        </div>
        <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-34 pt-4 sm:mt-0 text-center sm:text-left">
          <p className="leading-relaxed text-xl mb-4 text-justify">Collaboration with the artist of 'OneMask' for a special Spot Bot series drop. 
          Additional partnerships, gamification and value addition to existing holders!</p> 
        </div>
      </div>
    </div>
  </div>
</section>    
    
    
    </div>
  )
}
