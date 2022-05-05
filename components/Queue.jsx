import React from 'react'
import QueueRow from './QueueRow'


function Queue({data,type,handler}) {
  return (
    <div className='flex flex-col w-full'>
        {data ? data.map(item => (
                <QueueRow key={item.id} item={item} status={'Not Done'} type={type} handler={handler}></QueueRow>
            )) : null}
    </div>
  )
}

export default Queue