import React from 'react'
import AddStoreButton from './AddStoreButton';

//<div className='ml-3 flex items-center'>
//        <AddShopButton store={item.store}></AddShopButton>  
//        </div>  
function QueueRow({item,status,type,handler}) {
  let color = status === 'Done' ? 'greensig' : 'redsig';
  return (
    <div className='flex'>
        {type != 'add'? <div className={`rounded-full p-4 my-2 ${color}`}></div>: <AddStoreButton handler={handler} text={'+'}></AddStoreButton>}
        
        <div className='bg-gray-200 w-px max-h-full ml-3 mr-3'></div>
        <div className='flex items-center '>
        <p className=' font-semibold h-fit'>{item.storename}</p>
        </div>
         
    </div>
 
  )
}

export default QueueRow