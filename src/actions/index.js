import {MichelsonMap, TezosToolkit} from "@taquito/taquito";
import {
  NetworkType,
} from "@airgap/beacon-sdk";
import axios from "axios";
import config from '../config';
import {bytes2Char} from "@taquito/utils";



export const connectWallet = ({wallet, Tezos}) => {
    return async (dispatch)=>{
        try {
            var payload = {};

            Tezos.setWalletProvider(wallet)

            const activeAccount = await wallet.client.getActiveAccount();
            if(!activeAccount){
                await wallet.requestPermissions({
                network: {
                    type: NetworkType.GHOSTNET,
                    rpcUrl: "https://ghostnet.ecadinfra.com/"
                }
                });
            }
            const userAddress = await wallet.getPKH();
            const balance = await Tezos.tz.getBalance(userAddress);

            payload.user = {
                userAddress : userAddress,
                balance : balance.toNumber()
            }
            dispatch(_walletConfig(payload.user));

          } catch (error) {
              console.log(error);
              dispatch({
                  type: "CONNECT_WALLET_ERROR",
              })  
        }
    }
}

export const _walletConfig = (user) => {
    return {
        type:"CONNECT_WALLET",
        user,
    }
}

export const disconnectWallet = ({wallet, setTezos}) => {
    return async (dispatch) => {

        setTezos(new TezosToolkit("https://ghostnet.ecadinfra.com/"));

        dispatch({
            type:"DISCONNECT_WALLET",
        });

        if(wallet){
            await wallet.clearActiveAccount();
        }
      };
}

export const fetchData = ({Tezos}) => {
    return async (dispatch, getState) => {
        try {
            const contract = await Tezos.wallet.at(config.contractAddress);

            const storage = await contract.storage();
            dispatch({type:"SET_VALUE", payload: storage.toNumber()});
        }catch(e){
            //dispatch
            console.log(e);
        }
    }
}

export const mintNFT = ({ Tezos, address, amount, metadata }) => {
    return async (dispatch) => {
        try {
            const contract = await Tezos.wallet.at(config.contractAddress);
            let bytes = "";
            for (var i = 0; i < metadata.length; i++) {
                bytes += metadata.charCodeAt(i).toString(16).slice(-4);
            }
            console.log(bytes);
            const tokenId = 42;
            const michelsonMap = MichelsonMap.fromLiteral({
                "token_id": tokenId,
                "": bytes
            })
            const op = await contract.methods.mint(address, amount, michelsonMap).send();
            await op.confirmation();
            dispatch(fetchContractData());
        } catch (e) {
            console.log(e);
        }
    };
};

export const collectNFT = ({ Tezos, amount, id }) => {
    return async (dispatch) => {
        try {
            const contract = await Tezos.wallet.at(config.contractAddress);

            const op = await contract.methods
                .transfer(id)
                .send({ mutez: true, amount: amount });
            await op.confirmation();
            dispatch(fetchContractData());
        } catch (e) {
            console.log(e);
        }
    };
};

export const fetchContractData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `https://api.ghostnet.tzkt.io/v1/contracts/${config.contractAddress}/bigmaps/data/keys`
            );

            const d1 = response.data;
            let tokenData = [];
            for (let i = 0; i < d1.length; i++) {
                const metadata = d1[i].value;
                const tokenInfoBytes = metadata.token_info[""];

                if( tokenInfoBytes !== undefined ){
                    const tokenInfo = bytes2Char(tokenInfoBytes);
                    const s = tokenInfo.split("//").at(-1);
                    const res = await axios.get("https://ipfs.io/ipfs/" + s);
                    metadata.token_info["metadata"] = res;

                    tokenData[i] = {
                        ...metadata,
                    };
                }
            }
            dispatch({ type: "SET_TOKEN_DATA", payload: tokenData });

        } catch (e) {
            console.log(e);
        }
    };
};