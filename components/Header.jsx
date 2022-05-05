import React from 'react'
import ItemSearchInput from './ItemSearchInput'
import Location from './Location'
function Header() {
  return (
    <div className="sticky top-0 z-50 bg-color3 flex items-center p-2 lg:px-5 h-16 shadow-md">
        <h1 className='font-bold text-xl'>Tekky</h1>
        <div className='flex ml-auto'>
        <Location></Location>
        </div>
    </div>
  )
}

export default Header