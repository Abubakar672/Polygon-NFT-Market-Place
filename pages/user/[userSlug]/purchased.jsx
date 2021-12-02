import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftmarketaddress, nftaddress } from "../../../config";

import NFT_V1 from "../../../artifacts/contracts/NFT_V1.sol/NFT_V1.json";
import Market_V1 from "../../../artifacts/contracts/Market_V1.sol/NFTMarket_V1.json";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import User from "../../../components/User";
import Item from "../../../components/Item";

export default function UserCreatedPage() {
  const [nfts, setNfts] = useState([]);

  const router = useRouter();
  const { userSlug } = router.query;
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      // network: "mainnet",
      // cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market_V1.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT_V1.abi, provider);
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
          name: meta.data.name,
        };

        return item;
      })
    );
    console.log("items========>>", items);
    /* create a filtered array of items that have been sold */
    // const soldItems = items.filter((i) => i.sold);
    // setSold(soldItems);
    setNfts(items);
    // setLoadingState("loaded");
  }

  return (
    <main>
      <Head>
        <title>Created NFTs - {userSlug} | Mowsse</title>
      </Head>
      <User />
      <StyledTabLayout>
        <div className="tabs">
          <Link href={`/user/${userSlug}/created`} scroll={false} passHref>
            <a>Created</a>
          </Link>
          <Link href={`/user/${userSlug}/purchased`} scroll={false} passHref>
            <a className="active">Purchased</a>
          </Link>
        </div>
        <div className="grid">
          {nfts ? (
            <>
              {nfts?.map((d, key) => {
                return (
            
                    <Item
                      key={key}
                      to={`/asset/${d.tokenId}`}
                      title={d?.name}
                      price={d?.price}
                      image={d?.image}
                    />
                  
                );
              })}
            </>
          ) : null}
        </div>
      </StyledTabLayout>
    </main>
  );
}

const StyledTabLayout = styled.div`
  padding: 2rem;
  .tabs {
    overflow: auto;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e8eb;
    a {
      padding: 1rem 2rem;
      font-weight: 700;
      color: #707a83;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: transparent;
        border-radius: 8px 8px 0 0;
      }
    }
    .active {
      color: #000000;

      &:after {
        background-color: #2081e2;
      }
    }
  }
  .grid {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    @media (max-width: 1366px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 425px) {
      grid-template-columns: repeat(1, 1fr);
    }
    gap: 1rem;
  }
`;
