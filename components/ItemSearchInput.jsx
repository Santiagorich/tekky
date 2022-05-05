import React from 'react'

function ItemSearchInput({invert}) {
  return (
    <div className={`flex border-2 rounded-sm px-2 ${(invert)?'bg-white':''} max-w-fit`}>
        <input type="text" className='p-1 px-4 text-sm rounded-sm focus:outline-none bg-transparent' placeholder='Buscar productos...'/>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2.5 -2.5 24 24" width="16" fill="currentColor"><path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414z"></path></svg>
    </div>
  )
}

export default ItemSearchInput