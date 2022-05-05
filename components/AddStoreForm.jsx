import React,{useRef} from 'react'
var axios = require('axios');

function AddStoreForm({storeHandler}) {
  const urlin = useRef(null);
  const prodin = useRef(null);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if(urlin.current.value&&prodin.current.value){
        const encodedurl = encodeURIComponent(urlin.current.value);
        const encodedprod = encodeURIComponent(prodin.current.value);
        var config = {
            method: 'post',
            url: `http://localhost:3000/api/generator/querifySpec?url=${encodedurl}&query=${encodedprod}`,
            headers: {}
        };
    
        axios(config).then(function (response) {
            console.log("Added");
            console.log(response.data);
            storeHandler();
        }).catch(function (error) {
            console.log(error);
        });

      }
    }
  }

  return (
    <div>
      <div className='flex flex-col gap-3'>
      <h2>Url:</h2>

      <div className='flex border-2 rounded-full px-2'>
        <input type="text" ref={urlin} onKeyDown={(e)=>handleKeyDown(e)} className='p-1 px-4 text-sm rounded-full focus:outline-none'/>
    </div>
    <h2>Any product:</h2>
    <div className='flex border-2 rounded-full px-2'>
        <input type="text" ref={prodin} onKeyDown={(e)=>handleKeyDown(e)} className='p-1 px-4 text-sm rounded-full focus:outline-none'/>
    </div>
    </div>
    </div>
  )
}

export default AddStoreForm