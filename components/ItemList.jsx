import React from 'react'
import Image from 'next/image'
import Item from './Item'
//                      <Image src={`/api/imageProxy?url=${encodeURIComponent(item.image)}`} width='140px' height='140px' className='rounded-md' objectFit='contain'></Image>
function ItemList({items}) {
  console.log(items);
  return (
    <div className='flex flex-col gap-1 shadow-md max-h-full w-full overflow-y-scroll bg-white rounded-md'>
        {(items.length>0 ? items.map(item => (
                (!item.name == "")?
                <Item item={item}></Item>
                :null
                  
                

        )):<div className=' flex h-screen items-center justify-center'>
          <p className=' text-gray-400 text-2xl'>It do be lookin' empty, try to search for products!</p>
        </div>)}
                
    </div>
  )
}

export default ItemList