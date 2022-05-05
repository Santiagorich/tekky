import React from 'react'

function StoreCounter({count}) {
  return (
    <div className=' pl-3 pr-3 bg-cyan-500 rounded-full text-white'>
        <h1>Stores in database: {count}</h1>
    </div>
  )
}

export default StoreCounter