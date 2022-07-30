import React from 'react';
import TeamCard from '../TeamCard';
import teamData from '../teamData';

export default function Team() {
  
  function createTeamCard(member) {
    return(
      <div>
        <TeamCard 
        key={member.id}
        name={member.displayName}
        role={member.role}
        twitter={member.twitterLink}
        image={member.image}
        />
      </div>
    )
  }
  
  return (
    <div className="h-full">

<section className="text-gray-400 body-font font-mono">
    <div className="container px-24 py-10 mx-auto">
    <div className="lg:text-left sm:text-center"><h1 className='text-5xl font-mono uppercase text-yellow-400 ml-5 mt-10 pt-10 pb-10'>TEAM</h1></div>
    <div className='text-left w-full mb-20 h-full'>
        
        <div className="flex flex-wrap">
        {teamData.map(createTeamCard)}
        
        </div> 
        
      </div>
      </div>
    </section>

    </div>
 
    
  )
}
