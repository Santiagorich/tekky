import React from 'react'
import Image from 'next/image'
import Item from './Item'
//                      <Image src={`/api/imageProxy?url=${encodeURIComponent(item.image)}`} width='140px' height='140px' className='rounded-md' objectFit='contain'></Image>
function ItemList({items}) {
  return (
    <div className='flex flex-col gap-1 shadow-md max-h-screen w-full overflow-y-scroll bg-white rounded-md'>
        {items.map(item => (
                (!item.name == "")?
                <Item item={item}></Item>
                :null
                  
                

        ))}
                
    </div>
  )
}

export default ItemList