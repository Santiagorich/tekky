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
import { app } from './utils/firebase';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import AddStoreButton from "../components/AddStoreButton";
import Modal from "../components/Modal";
import axios from "axios";

const db = getFirestore(app);
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
  const [location, setLocation] = useState({});

  const getNearbyStores = async (lat, lng) => {
    if(lat && lng){
    axios.get('http://localhost:3000/api/generator/nearby?lat='+lat+'&lng='+lng).then(function (response) {
      console.log(response.data);
    }
    ).catch(function (error) {
      console.log(error);
    }
    );
  }
  };

  const getStores = async () => {
    let snapshot = await getDocs(firequery(collection(db, "stores")));
    let storesarr = [];
    snapshot.docs.forEach((doc) => {
      storesarr.push(doc.data());
    });
    setStores(storesarr);
    setStoreCount(storesarr.length);
  };

  const [items, setItems] = useState([]);

  const inpchanged = (arr) => {
    setItems(arr);
    getStores();
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    getStores();
  }, []);
  //useEffect(() => {
  //  getNearbyStores(location.lat, location.lng).then((stores) => {
  //    console.log("Nearby Stores:");
  //  });
  //}, [location]);
  const [showModal, setShowModal] = useState(false);

  const modalHandler = (bool) => {
    setShowModal(bool);
  };

  return (
    <div>
      <Header location={location}></Header>
      <div className={!showModal ? "hidden" : null}>
        <Modal
          handler={modalHandler}
          stores={stores}
          storeHandler={getStores}
        ></Modal>
      </div>

      <div className="flex flex-row h-max">
        <div className="p-6 flex flex-col items-center gap-5 bg-white flex-shrink-0 border-r-2 overflow-auto border-gray-300">
          <StoreCounter count={storeCount}></StoreCounter>
          <StoreSearchInput></StoreSearchInput>
          <Queue data={stores}></Queue>
          <AddStoreButton
            handler={modalHandler}
            text={"Add Store"}
          ></AddStoreButton>
          <div className=" bg-gray-300 h-px w-full"></div>
          <QuickGet changeitems={(arr) => inpchanged(arr)}></QuickGet>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex flex-col py-2 items-center">
            <ItemSearchInput
              invert={true}
              stores={stores}
              changeitems={(arr) => inpchanged(arr)}
            ></ItemSearchInput>
          </div>
          <div className="px-8 pb-16 max-h-screen">
            <div className="pb-2">
              <ItemCounter count={items.length}></ItemCounter>
            </div>
            <ItemList items={items}></ItemList>
          </div>
        </div>
      </div>
    </div>
  );
}
