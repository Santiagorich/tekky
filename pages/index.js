import Header from "../components/Header";
import Queue from "../components/Queue";
import StoreSearchInput from "../components/StoreSearchInput";
import StoreCounter from "../components/StoreCounter";
import ItemList from "../components/ItemList";
import ItemSearchInput from "../components/ItemSearchInput";
import ItemCounter from "../components/ItemCounter";
import QuickGet from "../components/QuickGet";
import { useState, useEffect } from "react";
import { getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import AddStoreButton from "../components/AddStoreButton";
import Modal from "../components/Modal";

const firequery = query;
  const firebaseConfig = {
      apiKey: "AIzaSyBvnhh1tfalJo2a4llWcRKq4u8-zuoDP80",
      authDomain: "tekky-dd9c7.firebaseapp.com",
      projectId: "tekky-dd9c7",
      storageBucket: "tekky-dd9c7.appspot.com",
      messagingSenderId: "687067575293",
      appId: "1:687067575293:web:a9539014646e6634c7df94",
      measurementId: "G-CP91C3HKYZ"
  };
  
  
  if (getApps().length === 0) {
      initializeApp(firebaseConfig);
  }
  
  const db = getFirestore();
export default function Home() {
  const [storeCount, setStoreCount] = useState("-");
  const [stores, setStores] = useState([]);

  //const data = [
  //  {
  //    id:1,
  //    store: "www.tiendamia.com",
  //    status: "Done"
  //  },
  //  {
  //    id:2,
  //    store: "www.tiendamia.com",
  //    status: "In Queue"
  //  },
  //  {
  //    id:3,
  //    store: "www.tiendamia.com",
  //    status: "In Queue"
  //  }];
  async function getStores() {
    let snapshot = await getDocs(firequery(collection(db, 'stores')))
    let storesarr = [];
    snapshot.docs.forEach(doc => {
      storesarr.push(doc.data());
    });
    setStores(storesarr);
    setStoreCount(storesarr.length);
  }
  
  const [items, setItems] = useState([]);
  
  const inpchanged = (arr) => {
    setItems(arr);
    getStores();
  }
  useEffect(() => {
    getStores();
  }, []);
  const [showModal, setShowModal] = useState(false);

  const modalHandler = (bool) => {
    setShowModal(bool);
  }

  return (
    <div>
      <Header></Header>
      <div className={!showModal ? 'hidden' : null}>
      <Modal handler={modalHandler} stores={stores} storeHandler={getStores} ></Modal>

      </div>
      
      <div className="flex flex-row h-screen">
        <div className="p-6 flex flex-col items-center gap-5 bg-white flex-shrink-0 border-r-2 overflow-auto border-gray-300">
          <StoreCounter count={storeCount}></StoreCounter>
          <StoreSearchInput></StoreSearchInput>
          <Queue data={stores}></Queue>
          <AddStoreButton handler={modalHandler} text={'Add Store'}></AddStoreButton>
          <div className=' bg-gray-300 h-px w-full'></div>
          <QuickGet changeitems={(arr)=>inpchanged(arr)}></QuickGet>
        </div>
        <div className="p-4 flex flex-col flex-grow gap-5">
          <div className="flex flex-col gap-5 py-2 items-center">
          <ItemSearchInput invert={true}></ItemSearchInput>
          </div>
          <div className="px-8">
          <div className="pb-2"><ItemCounter count={items.length}></ItemCounter></div>
          <ItemList items={items}></ItemList></div>
        </div>
      </div>

    </div>
  )
}