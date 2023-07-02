import React from "react";

const TokenCard = ({ item, onClick, onCollect }) => {

    return (
        <div className="ui fluid card">

            { item?.token_info?.metadata?.data.displayUri ?
                <div className="image">
                    <img
                        onClick={onClick}
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                        src={`https://ipfs.io/ipfs/${item?.token_info?.metadata?.data.displayUri.split("ipfs://")[1]}`}
                        alt={item?.token_info?.metadata?.data.description}
                    />
                </div>
                : <></>
            }

            { item?.token_info?.metadata?.data.image ?
                <div className="image">
                    <img
                        onClick={onClick}
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                        src={`https://ipfs.io/ipfs/${item?.token_info?.metadata?.data.image.split("ipfs://")[1]}`}
                        alt={item?.token_info?.metadata?.data.description}
                    />
                </div>
                : <></>
            }


            <div className="content">
                <div className="right floated">
                    Price:
                    <div style={{ color: "black" }}>0</div>
                </div>
                <div className="header">{item?.token_info?.metadata?.data.name}</div>
                <div className="meta">{item?.token_info?.metadata?.data.symbol}</div>
                <div className="description">
                    {item?.token_info?.metadata?.data.description}
                </div>
            </div>

            <div className="extra content">
                <span className="right floated">
                  <button className="ui basic button" onClick={onCollect}>
                    {item?.collectable ? "Buy" : "Sold Out"}
                  </button>
                </span>
                <span>
                    Token ID:
                    <div style={{ color: "black" }}>{item?.token_id}</div>
                </span>
            </div>
        </div>
    );
};

export default TokenCard;