import React,{useRef} from 'react'
var axios = require('axios');

function ItemSearchInput({invert,stores,changeitems}) {
  const queryinp = useRef(null);
  const handleEnter = (event) => {
    if (event.key === 'Enter') {

    if (queryinp.current.value != "") {
      let dataarr = [];
      let promisearr = [];
      stores.map(store => {
        console.log(store.storename)
        let encodedquery = encodeURIComponent(queryinp.current.value);
        let encodedurl = encodeURIComponent(store.storename);
        var config = {
          method: "post",
          url: `http://localhost:3000/api/generator/qg?url=${encodedurl}&query=${encodedquery}`,
          headers: {},
        };
        promisearr.push(axios(config)
          .then(function (response) {
            if (queryinp.current.value != "") {
              dataarr = [...dataarr,...response.data];
              changeitems(dataarr)
            }
          })
          .catch(function (error) {
            console.log(error);
          }));
      
      //Promise.all(promisearr).then(function () {
      //  changeitems(dataarr)
      //});
    });
  }
  }
  };
  return (
    <div className={`flex border-2 rounded-sm px-2 ${(invert)?'bg-white':''} max-w-fit`}>
        <input ref={queryinp} type="text" className='p-1 px-4 text-sm rounded-sm focus:outline-none bg-transparent' onKeyDown={(event) => handleEnter(event)} placeholder='Buscar productos...'/>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2.5 -2.5 24 24" width="16" fill="currentColor"><path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414z"></path></svg>
    </div>
  )
}

export default ItemSearchInput