import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import Button from "../components/Button";

import { nftaddress, nftmarketaddress } from "../config";

import NFT_V1 from "../artifacts/contracts/NFT_V1.sol/NFT_V1.json";
import Market_V1 from "../artifacts/contracts/Market_V1.sol/NFTMarket_V1.json";
import Web3 from "web3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function CreateItem() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [buttonText, setButtonText] = useState("Create");
  const fileRef = useRef();
  const [fileName, setFileName] = useState("Choose File");
  const [imgData, setImgData] = useState("/0");
  const router = useRouter();

  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  //   let web3;
  // useEffect(async()=>{
  //   if(typeof window !== undefined){
  //     /// You can get the connected user
  //     if(window.ethereum.selectedAddress){
  //       setAccount(window.ethereum.selectedAddress)
  //     }
  //     setInstall(true);
  //   }
  // }, [])

  // const getAccount = async () => {
  //   setLoading(true);
  //   try{
  //     if(typeof window !== undefined){
  //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //       const account = accounts[0];
  //       setAccount(account);
  //     }
  //     setLoading(false);
  //   }
  //   catch(err){
  //     setLoading(false);
  //   }
  // }

  //  console.log("acc======>>", getAccount);

  //Adding web3
  // const [web3, setWeb3] = useState(null)
  const [address, setAddress] = useState(null);

  const addPreview = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgData(reader.result);
    });
    reader.readAsDataURL(file);
  };

  async function createMarket() {
    // const { name, description, price } = formInput;
    toast.info("Creating the NFT");

    const name = itemName;
    const description = itemDescription;
    const price = itemPrice;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log("Url=======>>", url);
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT_V1.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    console.log("TX========>>", tx);
    let event = tx.events[0];

    let value = event.args[2];
    let tokenId = value.toNumber();
    console.log("tokenId======>>", tokenId);
    const price = ethers.utils.parseUnits(itemPrice, "ether");
    console.log("PRICE HERE ====>>", price);
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market_V1.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    //web3
    let web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    let finalPrice = Web3.utils.fromWei(listingPrice.toString(), "ether");
    console.log("listingPrice======>>", finalPrice);
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    console.log("TX2========>>", transaction);
    toast.success("Created successfully");
    setIsLoaderVisible(false);
    router.push("/explore");
  }

  const creatingtoast = (id) => {
    // console.log("clickedddddddddd", id)
    // toast.success("Creating the NFT");
  };

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <main>
      <ToastContainer />
      <LoadingScreen
        style={{
          display: isLoaderVisible ? "flex" : "none",
        }}
      >
        <div className="sk-fading-circle">
          <div className="sk-circle1 sk-circle"></div>
          <div className="sk-circle2 sk-circle"></div>
          <div className="sk-circle3 sk-circle"></div>
          <div className="sk-circle4 sk-circle"></div>
          <div className="sk-circle5 sk-circle"></div>
          <div className="sk-circle6 sk-circle"></div>
          <div className="sk-circle7 sk-circle"></div>
          <div className="sk-circle8 sk-circle"></div>
          <div className="sk-circle9 sk-circle"></div>
          <div className="sk-circle10 sk-circle"></div>
          <div className="sk-circle11 sk-circle"></div>
          <div className="sk-circle12 sk-circle"></div>
        </div>
      </LoadingScreen>
      <StyledCreate fileName={fileName}>
        <h1>Create new item</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setButtonText("Creating...");
            setIsLoaderVisible(true);
            try {
              await createMarket();
            } catch (err) {
              setIsLoaderVisible(false);
              setButtonText("Failed");
            }
          }}
        >
          <label>
            <h3>
              Image File<span>*</span>
            </h3>
            <p>File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB</p>
            <input
              type="file"
              ref={fileRef}
              onChange={(e) => {
                onChange(e);
                setFileName(
                  e.target.files.length > 0
                    ? e.target.files[0].name
                    : "Choose File"
                );
                addPreview(e.target.files[0]);
              }}
            />
            <div className="preview">
              <Image
                src={imgData}
                alt={" "}
                height={300}
                width={300}
                layout="responsive"
              />
            </div>
          </label>
          <label>
            <h3>
              Name<span>*</span>
            </h3>
            <input
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </label>
          <label>
            <h3>
              Price<span>*</span>
            </h3>
            <input
              type="number"
              placeholder="Item Price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </label>
          <label>
            <h3>Description</h3>
            <textarea
              placeholder="Item Description"
              rows="8"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            ></textarea>
          </label>
          <Button type="submit" primary onClick={() => creatingtoast("dfghj")}>
            {buttonText}
          </Button>
        </form>
      </StyledCreate>
    </main>
  );
}

const StyledCreate = styled.section`
  padding: 8rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  form {
    width: 100%;
  }
  h1 {
    font-size: 2.5rem;
  }
  h3 {
    font-size: 1rem;
    margin-top: 2rem;
    span {
      color: red;
      font-size: 1.2rem;
      line-height: 1rem;
    }
  }
  p {
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 0.5rem;
    color: #707a83;
  }
  input,
  textarea {
    width: 100%;
    margin-top: 0.5rem;
    display: inline-block;
    background: transparent;
    color: #000000;
    padding: 0.8rem 1.5rem;
    border: 2px solid #e5e8eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    &[type="file"] {
      border: none;
      margin-top: 1rem;
      padding: 0;
      color: transparent;
      &::-webkit-file-upload-button {
        visibility: hidden;
      }
      &::before {
        display: inline-block;
        content: " ${(props) => props.fileName}";
        background: transparent;
        color: #2081e2;
        padding: 0.8rem 2rem;
        border: 2px solid #2081e2;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
      }
    }
  }
  textarea {
    transition: none;
  }
  .preview {
    position: relative;
    margin-top: 1rem;
    border: 2px solid #e5e8eb;
    border-radius: 1rem;
    overflow: hidden;
    display: block;
    font-size: 0.9rem;
    width: 300px;
    height: 300px;
    img {
      object-fit: contain;
      transition: all 0.3s ease;
      opacity: ${(props) => (props.fileName === "Choose File" ? "0" : "1")};
    }
    &::after {
      content: "Preview";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #707a83;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: -1;
    }
  }
  button {
    margin-top: 1rem;
  }
`;

const skCircleFadeDelay = keyframes`
  0%,
  39%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
`;

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  .sk-fading-circle {
    margin: 100px auto;
    width: 40px;
    height: 40px;
    position: relative;
  }

  .sk-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-fading-circle .sk-circle:before {
    content: "";
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #ffffff;
    border-radius: 100%;
    -webkit-animation: ${skCircleFadeDelay} 1.2s infinite ease-in-out both;
    animation: ${skCircleFadeDelay} 1.2s infinite ease-in-out both;
  }
  .sk-fading-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
    -ms-transform: rotate(30deg);
    transform: rotate(30deg);
  }
  .sk-fading-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
    -ms-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  .sk-fading-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .sk-fading-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
    -ms-transform: rotate(120deg);
    transform: rotate(120deg);
  }
  .sk-fading-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
    -ms-transform: rotate(150deg);
    transform: rotate(150deg);
  }
  .sk-fading-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .sk-fading-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
    -ms-transform: rotate(210deg);
    transform: rotate(210deg);
  }
  .sk-fading-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
    -ms-transform: rotate(240deg);
    transform: rotate(240deg);
  }
  .sk-fading-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg);
  }
  .sk-fading-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
    -ms-transform: rotate(300deg);
    transform: rotate(300deg);
  }
  .sk-fading-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
    -ms-transform: rotate(330deg);
    transform: rotate(330deg);
  }
  .sk-fading-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }
  .sk-fading-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }
  .sk-fading-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }
  .sk-fading-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }
  .sk-fading-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }
  .sk-fading-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }
  .sk-fading-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }
  .sk-fading-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }
  .sk-fading-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }
  .sk-fading-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }
  .sk-fading-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }
`;
