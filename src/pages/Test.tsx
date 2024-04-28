import React from 'react'


function Test() {
  return (
    <div className='text-black bg-gray-300 px-8 py-8'>

<nav>
        <ul className='flex  justify-between items-center'>
            <li className="p-2 bg-red-400 "><a href="#about">About US PS  </a></li>
            <li className="p-2 bg-yellow-400 text-5xl flex-grow flex-shrink-0"><a href="#service">About US </a></li>
            <li className="p-2 bg-green-400 flex-grow"><a href="#blog">BLOG  </a></li>
            <li className="p-2 bg-blue-400 " ><a href="#contact">Contact Me</a></li>
        </ul>
    </nav>

<div className='flex'>
  <div className='w-16 h-16 bg-cyan-200 rounded-full flex-shrink-1'>
    
  </div>
  <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure possimus dolorem vitae laboriosam a vero iste doloribus officiis porro quasi animi sequi sit excepturi velit voluptate laborum, sunt, dolore repudiandae! Libero exercitationem odit ipsam nesciunt obcaecati veniam repellendus debitis cumque! Laudantium eaque voluptatibus cumque vitae dolor recusandae dignissimos labore repudiandae iure fuga et officiis, id iusto ipsa molestias impedit aspernatur reprehenderit ea earum quis tenetur praesentium. Non delectus iure ullam aliquid commodi ducimus quaerat vel, ratione in error cupiditate earum at debitis minima, quisquam esse veniam dolores natus. Dolores veniam, similique deserunt ipsa facilis quo fugiat officia expedita! Quidem minus reprehenderit dolores vero facilis rerum laboriosam unde molestiae fuga animi a magnam nesciunt libero minima quo laborum amet tenetur veniam, nam voluptatum quam ex necessitatibus. Eius illo quibusdam inventore, beatae cupiditate debitis aut veniam reiciendis explicabo totam. Incidunt, corrupti! Laboriosam optio mollitia, laborum aliquam tempora numquam harum ducimus maxime earum.</div>
</div>


<div className='mt-12 flex  justify-between items-center flex-col md:flex-row space-x-3 space-y-3'>
            <div className="p-2 bg-red-400  flex-1 "><a href="#about">About US PS  </a></div>
            <div className="p-2 bg-yellow-400 flex-1"><a href="#service">About US </a></div>
            <div className="p-2 bg-green-400 flex-1/4 order-first md:order-none "><a href="#blog">BLOG  </a></div>
            <div className="p-2 bg-blue-400 flex-1/4" ><a href="#contact">Contact Me</a></div>
        </div>
    </div>



  )
}

export default Test