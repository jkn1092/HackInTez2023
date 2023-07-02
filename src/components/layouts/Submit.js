import React, {useState} from "react";

import { useFilePicker } from "use-file-picker";
import { NFTStorage, File } from "nft.storage";

import { mintNFT } from "../../actions";
import {useDispatch, useSelector} from "react-redux";

const apiKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY3MGQ3YzUwNGU0M2UzQjUzODdDODdGZDI5RDYyMmZEQ2FmRDdjYUIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODIyNDQ5NjIyMSwibmFtZSI6Ikhha2F0aG9uIn0.lPw6ftc5H-HV5gX1yb5Awh-CLWr1IrtHuzVZlRVzLKo";
const client = new NFTStorage({ token: apiKey });

const Submit = ({ Tezos }) => {
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();
    const [openFileSelector, { filesContent }] = useFilePicker({
        accept: [".png", ".jpg", ".jpeg"],
        multiple: false,
        readAs: "ArrayBuffer",
    });
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("0");
    const [error, setError] = useState("");
    const [loadingSubmit, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        if (
            name === "" ||
            author === "" ||
            description === "" ||
            amount === "" ||
            !/^-?\d+$/.test(amount) ||
            filesContent.length === 0
        ) {
            setError("Some Error Occurred. Please check entered details.");
            return;
        }
        setLoading(true);
        setError("");

        (async () => {
            const metadata = await client.store({
                name: name,
                description: description,
                decimals: 0,
                symbol: "P3Z",
                image: new File(
                    [filesContent[0].content],
                    filesContent[0].name,
                    { type: "image/" + filesContent[0].name.split(".")[1] }
                ),
            });

            dispatch(mintNFT({Tezos, address: selector.userAddress, amount, metadata: metadata.url}))

            setLoading(false);
            setName("");
            setAuthor("");
            setAmount("0");
            setDescription("");
        })();
    };

    return (
        <div>
            <form className="ui form error">
                <div
                    className={`field required ${
                        loadingSubmit ? "disabled" : ""
                    }`}
                >
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What if ?"
                    />
                </div>
                {name.length > 30 ? (
                    <div className="ui error message">
                        <div className="header">Too long!</div>
                        <p>The name must be less than 30 letters.</p>
                    </div>
                ) : null}


                <div
                    className={`field required ${
                        loadingSubmit ? "disabled" : ""
                    }`}
                >
                    <label>Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Who ?"
                    />
                </div>
                {author.length > 30 ? (
                    <div className="ui error message">
                        <div className="header">Too long!</div>
                        <p>The name must be less than 30 letters.</p>
                    </div>
                ) : null}

                <div
                    className={`field required ${
                        loadingSubmit ? "disabled" : ""
                    }`}
                >
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A digital book !"
                    />
                </div>
                {description.length > 300 ? (
                    <div className="ui error message">
                        <div className="header">Too long!</div>
                        <p>The Description must be less than 300 letters.</p>
                    </div>
                ) : null}
                <div
                    className={`field required ${
                        loadingSubmit ? "disabled" : ""
                    }`}
                >
                    <label>
                        Selling Amount (Mutez) (There is a 3% service fee)
                    </label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                    />
                </div>
                {!/^-?\d+$/.test(amount) && amount !== "" ? (
                    <div className="ui error message">
                        <div className="header">Only number allowed</div>
                        <p>The amount must be a valid Mutez value.</p>
                    </div>
                ) : null}
                <div
                    className={`field required ${
                        loadingSubmit ? "disabled" : ""
                    }`}
                >
                    <label>Image</label>
                    <button
                        type="button"
                        className="ui basic button"
                        onClick={(event) => {
                            openFileSelector();
                            event.preventDefault();
                        }}
                    >
                        Select files{" "}
                    </button>
                    {filesContent.length > 0 ? filesContent[0].name : ""}
                </div>
                {error ? (
                    <div className="ui error message">
                        <div className="header">Error</div>
                        <p>{error}</p>
                    </div>
                ) : null}

                <button
                    className={`ui button ${loadingSubmit ? "loading" : ""}`}
                    onClick={(e) => onSubmit(e)}
                    type="submit"
                >
                    Mint
                </button>
            </form>
        </div>
    );
};

export default Submit;