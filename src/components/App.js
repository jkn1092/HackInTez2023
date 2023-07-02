import React,{ useState, useEffect } from 'react';
import { Route, Routes } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { TezosToolkit} from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
  ColorMode
} from "@airgap/beacon-sdk";

import Header from './Header';
import { fetchContractData, _walletConfig } from '../actions';
import Home from "./layouts/Home";
import Show from "./layouts/Show";
import Submit from "./layouts/Submit";

const App = () => {
    const selector = useSelector(state => state);
    const dispatch = useDispatch();
    const [Tezos, setTezos] = useState(
        new TezosToolkit("https://ghostnet.ecadinfra.com/")
    );
    const [wallet, setWallet] = useState(null);

    useEffect(()=>{
        (async () => {
            const wallet_instance = new BeaconWallet({
                name: "NFT marketplace",
                preferredNetwork: NetworkType.GHOSTNET,
                colorMode: ColorMode.LIGHT,
                disableDefaultEvents: false, // Disable all events / UI. This also disables the pairing alert.
                eventHandlers: {
                // To keep the pairing alert, we have to add the following default event handlers back
                [BeaconEvent.PAIR_INIT]: {
                    handler: defaultEventCallbacks.PAIR_INIT
                },
                [BeaconEvent.PAIR_SUCCESS]: {
                    handler: data => { return (data.publicKey);}
                }
                }
            });
            Tezos.setWalletProvider(wallet_instance);
            const activeAccount = await wallet_instance.client.getActiveAccount();
            if (activeAccount) {
                const userAddress = await wallet_instance.getPKH();
                const balance = await Tezos.tz.getBalance(userAddress);
                dispatch(_walletConfig(
                    {
                        userAddress: userAddress, 
                        balance: balance.toNumber()
                    }));
            }
            setWallet(wallet_instance);
        })();
    },[Tezos, dispatch]);


    useEffect(()=>{
        dispatch(fetchContractData({Tezos}));
    },[Tezos, dispatch]);

    return (
        <div className="ui container">
            <Header Tezos={Tezos} setTezos={setTezos} wallet={wallet} />
            <div className="ui container center aligned">
                <p className="ui">User Address: {selector.walletConfig.user.userAddress}</p>
            </div>
            <br/>
            <div className="ui container">
                <Routes>
                    <Route path="/submit" element={<Submit Tezos={Tezos} />} />
                    <Route path="/show/:id" element={<Show Tezos={Tezos} />} />
                    <Route path="/" element={<Home Tezos={Tezos} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
