import React from 'react'

import Tours from '../components/spolucesty/Tours'
import CreateTour from '../components/spolucesty/CreateTour'

function Spolucesty() {
  return (
    <div className='px-4 h-full'>
    <CreateTour/>  
    <Tours/>      

    </div>
  )
}

export default Spolucesty