import React from 'react'


function NotFound404() {
  return (
    <div className='pt-10 pb-10 flex justify-center items-center flex-col gap-10'>

      
    <h1 className='text-3xl font-thin'>
        Uh-oh!
    </h1>
    <h2 className='text-3xl font-thin'>
        It could be you, or it could be us, but there's no page here.
    </h2>
    <h2 className='text-3xl font-thin'>
        Probably it is a 404 error. &nbsp;&nbsp;  It means the page does not exist.
    </h2>
      <img src={process.env.PUBLIC_URL + '/emoji.png'} alt="" className='flex'/>


    </div>
  )
}

export default NotFound404