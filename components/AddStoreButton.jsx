import React from 'react'

function AddStoreButton({handler,text}) {
  return (
    <div>
        <button className='bg-cyan-500 hover:bg-cyan-700 text-white font-medium m-1 px-2 rounded-full' onClick={() => handler(true)}>
            {text}
        </button>
    </div>
  )
}

export default AddStoreButton