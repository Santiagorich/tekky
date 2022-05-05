import React from 'react'

function Item({item}) {
  return (
    <div>
        <div key={item.id} className='flex justify-between px-1 py-1 border-b'>
    <div className='flex flex-row p-5'>
      <img src={item.image} className='rounded-md w-32 h-32 object-contain shrink-0' />
      <div className='ml-10 mt-2 w-auto'>
        <a href={item.url} className='overflow-ellipsis'>{item.name}</a>
        {(item.old) ? <p className='font-semibold text-xs line-through text-gray-500'>{item.currency} {item.old}</p> : null}
        <p className='font-semibold text-lg text-gray-900'>{item.currency} {item.price}</p>
      </div>
    </div>
</div>
</div>
  )
}

export default Item