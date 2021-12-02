import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FaEthereum, FaRegHeart } from "react-icons/fa";
import {
  MdRemoveRedEye,
  MdAccessTime,
  MdAccountBalanceWallet,
  MdShowChart,
  MdClose,
} from "react-icons/md";
import { BsTextLeft } from "react-icons/bs";
import { BiTransfer } from "react-icons/bi";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Accordion from "../../components/Accordion";
import { Line } from "react-chartjs-2";

import { nftaddress, nftmarketaddress } from "../../config";

import NFT_V1 from "../../artifacts/contracts/NFT_V1.sol/NFT_V1.json";
import Market_V1 from "../../artifacts/contracts/Market_V1.sol/NFTMarket_V1.json";

const data = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function Asset() {
  let user = useAuth();
  const router = useRouter();
  const { asset } = router.query;
  const [details, setDetails] = useState({});

  const [modalOpen, setModalOpen] = useState(false);

  const modal = () => {
    setModalOpen(!modalOpen);
  };

  //eslint-disable-next-line
  useEffect(async () => {
    if (asset) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market_V1.abi,
        signer
      );
      const tokenContract = new ethers.Contract(nftaddress, NFT_V1.abi, signer);

      console.log("<><><><><><><><><><><><><>", asset);
      let data = await marketContract.fetchTokeByID(Number(asset));
      console.log("data=>>>>>>.", data);
      const tokenUri = await tokenContract.tokenURI(asset);
      const meta = await axios.get(tokenUri);
      console.log("META=======>>", meta);

      let price = await ethers.utils.formatUnits(data.price.toString(), "ether");
      let cryptocompare = await axios.get(
        "https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD"
      );
      let priceUSD = price * cryptocompare.data.USD;
      console.log("price",price)
      console.log("PriceUsd====>>", priceUSD);
      let item = {
        price,
        priceUSD,
        tokenId: data.itemId.toNumber(),
        seller: data.seller,
        owner: data.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      };
      console.log("items======>>", item);
      setDetails(item);
    }
    }, [asset]);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT_V1.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market_V1.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i, key) => {
        const tokenUri = await tokenContract.tokenURI(key+1);
        // console.log("Token id here",i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    console.log("here i am comingggg ==============>", item);
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftmarketaddress,
      Market_V1.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    let res = await contract.getListingPrice();
    const price = ethers.utils.parseUnits(details?.price.toString(), "ether");
    console.log("price=====>>", price);
    const transaction = await contract.createMarketSale(
      nftaddress,
      Number(nft),
      {
        value: price,
      }
    );
    let response = await transaction.wait();
    console.log("response======>>", response);
    router.push("/user/self/created");
    // loadNFTs();
  }

  const [transferTargetWallet, setTransferTargetWallet] = useState("");
  const [transferStatus, setTransferStatus] = useState(null);
  const [transferActive, setTransferActive] = useState(false);

  //Transfer Function
  const handleTransfer = async () => {
    setTransferActive(true);
    setTransferStatus(
      `Transferring to ${transferTargetWallet.substr(
        0,
        7
      )}...${transferTargetWallet.slice(-5)}`
    );
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        Market_V1.abi,
        signer
      );

      /* user will be prompted to pay the asking proces to complete the transaction */
      const transaction = await contract.transferMarketSale(
        nftaddress,
        asset,
        transferTargetWallet
      );
      let response = await transaction.wait();
      setTransferStatus(`Transfer Successful!`);
      setTimeout(() => {
        router.push("/user/self/created");
      }, 3000);
    } catch (err) {
      console.log(err);
      setTransferActive(false);
      setTransferStatus(`Transfer Failed: ${err.message}`);
    }

    // loadNFTs();
  };

  return (
    <>
      {details ? (
        <>
          {" "}
          <main>
            <Head>
              <title>{asset} - Asset | Mowsse</title>
            </Head>
            {modalOpen && (
              <ModalUI>
                <div className="modal">
                  <button onClick={modal} className="close">
                    <MdClose className="close__icon" />
                  </button>
                  <h3>Transfer</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTransfer();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter Receiver Wallet Address"
                      onChange={(e) => {
                        setTransferTargetWallet(e.target.value);
                      }}
                      required
                    />
                    <div
                      style={{
                        opacity: transferActive ? 0.5 : 1,
                        pointerEvents: transferActive ? "none" : "all",
                      }}
                    >
                      <Button type="submit" primary>
                        Transfer
                      </Button>
                    </div>
                  </form>
                  {transferStatus && (
                    <div className="modal__status">
                      <p>{transferStatus}</p>
                    </div>
                  )}
                </div>
              </ModalUI>
            )}
            <StyledAsset>
              <AssetFlex>
                <Left>
                  <Box
                  // top={
                  //   <div className="hearts">
                  //     <FaRegHeart size={16} color="#707a83" />
                  //     <p>10</p>
                  //   </div>
                  // }
                  >
                    {details?.image ? (
                      <>
                        {" "}
                        <Image
                          src={details?.image}
                          // src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YXJ0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1"
                          alt={asset}
                          width={400}
                          height={400}
                          layout="responsive"
                        />
                      </>
                    ) : null}
                  </Box>
                </Left>
                <Right>
                  {/* <div className="info__user">ID: {asset}</div> */}
                  <p className="info__title">{details?.name}</p>
                  <div className="info__stats">
                    <p className="info__stats__owner">
                      Owned by <span href="/user/test">{details?.owner}</span>
                    </p>
                    {/* <p className="info__stats__views">
                <MdRemoveRedEye size={22} /> 123 views
              </p> */}
                  </div>
                  <Box
                    styles={{ marginBottom: "1rem" }}
                    top={<div className="info__sale">Buy this item</div>}
                  >
                    <div className="info__price">
                      <h4>Current price</h4>
                      <p className="info__price__amount">
                        <FaEthereum size={18} color="#8247E5" />
                        {details.price} <span>(${details?.priceUSD})</span>
                      </p>
                      <div className="actions">
                        {user.id &&
                          details?.owner &&
                          user.id.toLowerCase() !==
                            details?.owner.toLowerCase() && (
                            <Button
                              func={buyNft}
                              asset={asset}
                              // type="submit"
                              primary
                            >
                              <MdAccountBalanceWallet /> Buy now
                            </Button>
                          )}
                        {user.id &&
                          details?.owner &&
                          user.id.toLowerCase() ===
                            details?.owner.toLowerCase() && (
                            <Button func={modal} primary>
                              <BiTransfer /> Transfer
                            </Button>
                          )}
                      </div>
                    </div>
                  </Box>
                  {/* <Box
              styles={{ marginTop: "1rem" }}
              top={
                <div className="info__sale">
                  <MdAccessTime size={18} /> Lorem ipsum dolor sit amet.
                </div>
              }
            >
              <div className="info__price">
                <h4>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Neque enim, quisquam officiis blanditiis voluptatem minima
                  minus ullam mollitia sunt commodi?
                </h4>
              </div>
            </Box> */}
                  <Accordion
                    title="Description"
                    icon={<BsTextLeft size={20} />}
                    collapsed
                  >
                    {details?.description}
                  </Accordion>
                </Right>
              </AssetFlex>
              {/* <AssetFlex className="flex-2">
          <Left>
            <Accordion
              title="Description"
              icon={<BsTextLeft size={20} />}
              collapsed
            >
             {details?.description}
            </Accordion>
          </Left>
          <Right>
            <Accordion
              title="Price History"
              icon={<MdShowChart size={20} />}
              collapsed
            >
              <div className="info__price__chart">
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Provident, ab.
                </p>
                <Line style={{ width: "100%" }} data={data} options={options} />
              </div>
            </Accordion>
          </Right>
        </AssetFlex> */}
            </StyledAsset>
          </main>
        </>
      ) : null}
    </>
  );
}

const StyledAsset = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 8rem 1rem;
  .flex-2 {
    @media (max-width: 1366px) {
      flex-direction: column;
    }
  }
  .hearts {
    padding: 0.8rem 1.2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: #707a83;
    svg {
      margin-right: 0.5rem;
    }
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .info {
    &__user {
      margin: 1rem 0;
      a {
        color: #2081e2;
        font-size: 1rem;
        font-weight: 600;
      }
    }
    &__title {
      font-size: 2rem;
      font-weight: 700;
    }
    &__stats {
      margin: 2rem 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 0.9rem;
      /* font-weight: 600; */
      color: #707a83;
      &__owner {
        margin-right: 1rem;
        a {
          color: #2081e2;
        }
      }
      &__views {
        display: flex;
        align-items: center;
        svg {
          margin-right: 0.5rem;
        }
      }
    }
    &__sale {
      padding: 0.8rem 1.2rem;
      display: flex;
      align-items: center;
      color: #707a83;
      font-size: 0.9rem;
      font-weight: 600;
      svg {
        margin-right: 0.5rem;
      }
    }
    &__price {
      &__chart {
      }
      padding: 1.2rem;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          margin-right: 0.5rem;
        }
      }
      h4 {
        font-size: 0.9rem;
        font-weight: 400;
        color: #707a83;
      }
      &__amount {
        font-size: 2rem;
        font-weight: 700;
        margin: 0.5rem 0;
        svg {
          margin-right: 0.5rem;
        }
        span {
          font-weight: 600;
          color: #707a83;
          font-size: 0.9rem;
        }
      }
    }
  }
`;

const AssetFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 4;
  width: 100%;
`;

const Right = styled.div`
  width: 100%;
  flex: 6;
  display: flex;
  flex-direction: column;
`;

const ModalUI = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 99;
  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 2rem;
    width: calc(100% - 2rem);
    max-width: 768px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
    z-index: 100;
    &__status {
      padding: 0.8rem 1rem;
      background: #e6e6e6;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
    }
    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      /* color: #707a83; */
    }
    input {
      display: block;
      margin: 1rem 0;
      width: 100%;
      border: 1px solid #e6e6e6;
      border-radius: 0.5rem;
      padding: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: #707a83;
    }
    .close {
      position: absolute;
      top: 1.2rem;
      right: 2rem;
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
      background: transparent;
      border: none;
      &__icon {
        transition: all 0.3s ease;
        transform: rotateZ(0deg);
      }

      &:hover {
        color: #2081e2;
        .close__icon {
          transform: rotateZ(90deg);
        }
      }
    }
  }
`;
