import React from 'react'
import AddStoreForm from './AddStoreForm'
import StoreSearchInput from "../components/StoreSearchInput";
import StoreCounter from "../components/StoreCounter";
import Queue from "./Queue";
function Modal({handler,stores,storeHandler}) {

  return (
    <div>
        <div
    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
  >
    <div className="relative w-5/6 h-5/6 my-6 mx-auto max-w-3xl">
      {/*content*/}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        {/*header*/}
        <div className="flex p-5 border-b border-solid border-slate-200 rounded-t items-center gap-5">
          <h3 className="text-3xl font-semibold">
            Añadir Tienda
          </h3>
          <StoreCounter count={stores.length}></StoreCounter>
         
          <button
            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={() => handler(false)}
          >
            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
              ×
            </span>
          </button>
        </div>
        {/*body*/}
        <div className="relative p-6 flex-auto">
          <div className="flex gap-10">
          <AddStoreForm storeHandler={storeHandler}></AddStoreForm>
          <div className="p-6 flex flex-col items-center gap-5 bg-white overflow-y-scroll flex-grow" >
          <StoreSearchInput></StoreSearchInput>
          <Queue data={stores} type='add'></Queue>
          </div>
          </div>
        </div>
        {/*footer*/}
        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => handler(false)}
          >
            Close
          </button>
          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => handler(false)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
  )
}

export default Modal