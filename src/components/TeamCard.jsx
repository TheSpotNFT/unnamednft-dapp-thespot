import React from 'react'

function TeamCard(props) {
  return (
    <div className="p-5 w-96">
        <div className="h-full flex border-gray-200 border p-4 rounded-lg bg-slate-800 hover:bg-slate-700  transition ease-in-out delay-100 hover:scale-110">
          <img alt="team" className="w-20 h-20 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-10 border-4 border-spot-yellow" src={props.image}/>
          <div className="flex-grow">
            <h2 className="text-spot-yellow title-font font-bold text-xl">{props.name}</h2>
            <p className="">{props.role}</p>
          
            <a href={props.twitter} className="ml-2">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5 hover:scale-150 hover:rotate-45" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
          </div>
        </div>
      </div> 
  )
}

export default TeamCard;