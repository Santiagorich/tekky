import React,{useRef} from 'react'
var axios = require('axios');

function QuickGet({changeitems}) {
  const urlin = useRef(null);
  const prodin = useRef(null);
  const queryin = useRef(null);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if(urlin.current.value&&queryin.current.value || urlin.current.value&&prodin.current.value){
          let encodedurl = encodeURIComponent(urlin.current.value);
          let encodedprod = encodeURIComponent(prodin.current.value);
          let encodedquery = encodeURIComponent(queryin.current.value);
          var config = {
            method: 'post',
            url: `http://localhost:3000/api/generator/qg?url=${encodedurl}${(queryin.current.value!='')? `&query=${encodedquery}`:''}${(prodin.current.value!='')? `&prod=${encodedprod}`:''}`,
          };
          axios(config)
          .then(function (response) {
            if(queryin.current.value!=''){
              changeitems(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      }
    }
  }



  return (
    <div>
      <h1 className=' text-center text-2xl font-bold mb-4'>QuickGet</h1>
      <div className='flex flex-col gap-3'>
      <h2>Url after looking for a product:</h2>

      <div className='flex border-2 rounded-full px-2'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2.5 -2.5 24 24" width="16" fill="currentColor"><path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414z"></path></svg>
        <input type="text" ref={urlin} onKeyDown={(e)=>handleKeyDown(e)} className='p-1 px-4 text-sm rounded-full w-full focus:outline-none'/>
    </div>
    <h2>Any product in the results: (Optional if on database)</h2>
    <div className='flex border-2 rounded-full px-2'>
        <input type="text" ref={prodin} onKeyDown={(e)=>handleKeyDown(e)} className='p-1 px-4 text-sm rounded-full w-full focus:outline-none'/>
    </div>
    <h2>Query:</h2>
    <div className='flex border-2 rounded-full px-2'>
        <input type="text" ref={queryin} onKeyDown={(e)=>handleKeyDown(e)} className='p-1 px-4 text-sm rounded-full w-full focus:outline-none'/>
    </div>
    </div>
    </div>
  )
}

export default QuickGet