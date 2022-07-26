import React from 'react'

function Item({item}) {
  let storeName = item.store.replace('www.',"").replace('.com','').replace('.uy',''); 
  return (
    <div>
          <div className='flex flex-row px-5 py-3 border-b'>
          <div key={item.id} className='flex justify-between px-1 py-1'>
        
      <img src={item.image} className='rounded-md w-32 h-32 object-contain shrink-0' />
      
      <div className='ml-10 w-auto'>
          <p className='bg-honey rounded-full w-fit px-2 mb-2'>{storeName.charAt(0).toUpperCase() + storeName.slice(1)}</p>
      <a href={item.url} className='overflow-ellipsis'> {item.name}</a>
        {(item.old) ? <p className='font-semibold text-xs line-through text-gray-500'>{item.currency} {item.old}</p> : null}
        <p className='font-semibold text-lg text-gray-900'>{item.currency} {item.price}</p>
      </div>
    </div>
</div>
</div>
  )
}

export default Item