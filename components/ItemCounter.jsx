import React from 'react'

function ItemCounter({count}) {
  return (
    <div className=' pl-3 pr-3 bg-cyan-500 rounded-full text-white max-w-fit self-center'>
        <h1>Items found: {count}</h1>
    </div>
  )
}

export default ItemCounter