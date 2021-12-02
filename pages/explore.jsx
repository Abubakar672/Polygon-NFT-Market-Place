import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import styled from "styled-components";
import Item from "../components/Item";
import Accordion from "../components/Accordion";
import Button from "../components/Button";

import { nftmarketaddress, nftaddress } from "../config";

import NFT_V1 from "../artifacts/contracts/NFT_V1.sol/NFT_V1.json";
import Market_V1 from "../artifacts/contracts/Market_V1.sol/NFTMarket_V1.json";

export default function Explore() {
  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    console.log("connection=========", connection);
    const provider = new ethers.providers.Web3Provider(connection);
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
        console.log("i<><><><><><<>",key)
        const tokenUri = await tokenContract.tokenURI(key+ 1);

        console.log("tokenURI======>>", tokenUri);
        const meta = await axios.get(tokenUri);
        console.log("META=======>>", meta);

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
        console.log("items======>>", item);
        return item;
      })
    );
    setNfts(items);
  }

  return (
    <StyledExploreMain>
      <aside>
        <h4>Filters</h4>
        <div className="filters">
          <Accordion title="Price" collapsed>
            <div className="inputs inputs__two">
              <input type="number" placeholder="Min" step="0.1" min="0" />
              <input type="number" placeholder="Max" step="0.1" min="0" />
            </div>
          </Accordion>
          <div className="btn">
            <Button>Apply</Button>
          </div>
        </div>
      </aside>
      <StyledExplore>
        <div className="stats">{nfts.length} results found</div>
        <div className="grid">
          {nfts.reverse().map((d, key) => {
            return (
              
                <Item
                key={key}
                  to={`/asset/${d.tokenId + 1}`}
                  title={d.name}
                  // user="Test User"
                  // isVerified
                  price={d.price}
                  // lastPrice={1.8}
                  // heart={12}
                  image={d.image}
                />
              
            );
          })}
        </div>
      </StyledExplore>
    </StyledExploreMain>
  );
}

const StyledExploreMain = styled.main`
  padding: 8rem 2rem;
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  aside {
    padding: 0;
    flex: 1;
    margin-right: 1rem;
    @media (max-width: 768px) {
      margin-right: 0;
    }
    h4 {
      font-size: 1rem;
      margin-left: 1rem;
    }
  }
  input {
    margin-right: 1rem;
    padding: 0.8rem 1.2rem;
    width: 100%;
    border: 2px solid #ccc;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    font-weight: 600;
  }
  .filters {
    padding: 2rem 0;
    div {
      h3 {
        font-size: 1rem;
      }
      font-size: 0.9rem;
    }
    .btn {
      margin-top: 1rem;
      button {
        width: 100%;
        font-size: 0.9rem;
        border: 1px solid #e5e8eb;
        color: #000;
      }
    }
  }
  .inputs {
    &__two {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`;

const StyledExplore = styled.section`
  flex: 3;
  .stats {
    padding: 0 0 2rem 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
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
