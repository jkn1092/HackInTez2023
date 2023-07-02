import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { collectNFT } from "../../actions";

const Show = ({ Tezos }) => {
    const selector = useSelector((state) => state.tokenData);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const temp = selector[parseInt(id)];
        if (temp) {
            setData(temp);
        }
    }, [selector, id]);
    return (
        <div className="ui internally celled grid">
            {data !== null ? (
                <>
                    <div className="ui">{data?.token_info?.metadata?.data.description}</div>
                    <div className="row">
                        <div className="nine wide column">
                            <img
                                src={`https://ipfs.io/ipfs/${data?.token_info?.metadata?.data.displayUri.split("ipfs://")[1]}`}
                                alt={data?.token_info?.metadata?.data.description}
                            />
                        </div>
                        <div className="seven wide column container center">
                            <div className="ui">
                                <h3 className="ui right floated header">{data?.token_info?.metadata?.data.name}</h3>
                                <h3 className="ui left aligned header">Name</h3>
                            </div>
                            <div className="ui">
                                <h3 className="ui right floated header">{data?.token_info?.metadata?.data.symbol}</h3>
                                <h3 className="ui left aligned header">Symbol</h3>
                            </div>
                            <div
                                className="ui "
                                onClick={() => {
                                    navigator.clipboard.writeText(data?.token_info?.metadata?.data.author + "");
                                }}
                            >
                                <h3
                                    className="ui right floated header green"
                                    style={{ cursor: "pointer" }}
                                    data-content="Copy to clipboard"
                                >
                                    {data?.token_info?.metadata?.data.author}
                                </h3>
                                <h3 className="ui left aligned header">Author</h3>
                            </div>
                            <div className="ui">
                                <h3 className="ui right floated header">{data?.token_info?.metadata?.data.amount}</h3>
                                <h3 className="ui left aligned header">Price</h3>
                            </div>
                            <div className="ui">
                                <h3 className="ui right floated header">{data.token_id}</h3>
                                <h3 className="ui left aligned header">Token ID</h3>
                            </div>
                        </div>
                    </div>
{/*                    <div className="ui">
                        <button
                            className="fluid ui button basic green"
                            onClick={() =>
                                data.collectable &&
                                dispatch(
                                    collectNFT({
                                        Tezos,
                                        amount: data?.token_info?.metadata?.data.amount,
                                        id: data.token_id,
                                    })
                                )
                            }
                        >
                            {data?.token_info?.metadata?.data.collectable ? "Buy" : "Sold Out"}
                        </button>
                    </div>*/}
                </>
            ) : null}
        </div>
    );
};

export default Show;