import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { useEffect, useRef } from "react";
import { nftmarketaddress, nftaddress } from "../config";

import NFT_V1 from "../artifacts/contracts/NFT_V1.sol/NFT_V1.json";
import Market_V1 from "../artifacts/contracts/Market_V1.sol/NFTMarket_V1.json";

import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";

import Button from "./Button";
import useAuth from "../hooks/useAuth";
import { MdClose, MdEdit } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User() {
  let user = useAuth();
  const [address, setAddress] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const modal = () => {
    setModalOpen(!modalOpen);
  };

  const imageUploadRef = useRef();
  const [userDescription, setUserDescription] = useState(
    user.profileData
      ? user.profileData[0].description
      : "Getting Your Profile..."
  );

  useEffect(() => {
    if (user.profileData) {
      setUserDescription(user.profileData[0].description);
    }
  }, [user.profileData]);

  const [profilePictureUpdating, setProfilePictureUpdating] = useState(false);

  const updateProfilePicture = async () => {
    const formData = new FormData();
    formData.append("image", imageUploadRef.current.files[0]);
    if (
      imageUploadRef.current.files[0].type === "image/png" ||
      imageUploadRef.current.files[0].type === "image/jpeg" ||
      imageUploadRef.current.files[0].type === "image/jpg"
    ) {
      toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            setProfilePictureUpdating(true);
            const response = await fetch(
              `/api/userData/updateImage?id=${user.id}`,
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            if (data.status) {
              resolve(data.message);
              setTimeout(() => {
                window.location.reload();
              }, 4000);
            } else {
              setProfilePictureUpdating(false);
              reject(data.err);
            }
          } catch (error) {
            setProfilePictureUpdating(false);
            reject(error.message);
          }
        }),
        {
          pending: "Uploading... Please Wait...",
          success: {
            render: ({ data }) => {
              console.log(data);
              return `${data}`;
            },
          },
          error: {
            render: ({ data }) => {
              return `${data}`;
            },
          },
        }
      );
    } else {
      toast.error("Only jpeg, jpg and png files are allowed!");
    }
  };

  const updateProfileDescription = async () => {
    toast.info("Updating Description...");
    try {
      const response = await fetch(
        `/api/userData/updateDescription?id=${user.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            description: userDescription,
          }),
        }
      );
      const data = await response.json();
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let address = await signer.getAddress();
    console.log("address=======", address);
    setAddress(address);
    // const marketContract = new ethers.Contract(
    //   nftmarketaddress,
    //   Market_V1.abi,
    //   signer
    // );
    // const tokenContract = new ethers.Contract(nftaddress, NFT_V1.abi, provider);
    // const data = await marketContract.fetchMyNFTs();

    // const items = await Promise.all(
    //   data.map(async (i) => {
    //     const tokenUri = await tokenContract.tokenURI(i.tokenId);
    //     const meta = await axios.get(tokenUri);
    //     let price = ethers.utils.formatUnits(i.price.toString(), "ether");
    //     let item = {
    //       price,
    //       tokenId: i.tokenId.toNumber(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       image: meta.data.image,
    //     };
    //     return item;
    //   })
    // );
    // setNfts(items);
  }

  return (
    <StyledUser>
      <ToastContainer />
      {modalOpen && (
        <ModalUI>
          <div className="modal">
            <button onClick={modal} className="close">
              <MdClose className="close__icon" />
            </button>
            <h3>Edit Description</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfileDescription();
              }}
            >
              <input
                type="text"
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Description"
              />
              <Button type="submit" primary>
                Update
              </Button>
            </form>
          </div>
        </ModalUI>
      )}
      <div className="cover">
        <Image
          src="https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
          alt="Cover"
          layout="fill"
        />
      </div>
      <div className="user">
        <div
          className="dp"
          style={{
            backgroundColor: profilePictureUpdating ? "grey" : "white",
            opacity: profilePictureUpdating ? 0.5 : 1,
          }}
        >
          {user.profileData && (
            <Image
              src={
                user.profileData[0].image
                  ? "data:image/png;base64," +
                    user.profileData[0].image.toString("base64")
                  : "/placeholder.png"
              }
              alt="Cover"
              width="200"
              height="200"
              layout="responsive"
              unoptimized
            />
          )}
          <div className="upload">
            <label>
              <MdEdit size={24} title="Edit Profile Picture" />
              <input
                type="file"
                ref={imageUploadRef}
                onChange={() => updateProfilePicture()}
              />
            </label>
          </div>
        </div>

        <div className="details">
          <p style={{ marginBottom: "1rem" }}>{address}</p>

          <p style={{ marginBottom: "1.5rem" }}>
            {userDescription}{" "}
            {user.profileData && (
              <button onClick={() => modal()}>
                <MdEdit size={18} title="Edit Description" />
              </button>
            )}
          </p>
        </div>
      </div>
    </StyledUser>
  );
}

const StyledUser = styled.section`
  margin-top: 4rem;
  .cover {
    height: 200px;
    max-height: 200px;
    overflow: hidden;
    background-color: black;
    position: relative;
    img {
      min-height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  .dp {
    width: 40%;
    max-width: 200px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 4px solid #ffffff;
    overflow: hidden;
    margin: 0 auto;
    background-color: #ffffff;
    position: relative;
    &:hover {
      .upload {
        opacity: 1;
      }
    }
    .upload {
      opacity: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      label {
        cursor: pointer;
        padding: 100px;
        background-color: rgba(0, 0, 0, 0.5);
        color: #ffffff;
        transition: all 0.3s ease;
        input {
          display: none;
        }
      }
      /* transform: translate(-50%, -50%); */
      input {
        /* opacity: 0; */
        pointer-events: none;
      }
    }
    img {
      object-fit: cover;
      object-position: center;
    }
    transform: translateY(-50%);
  }
  .details {
    /* transform: translateY(-50%); */
    margin-top: -5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 1rem;
    button {
      background: transparent;
      border: none;
      cursor: pointer;
      margin-left: 0.5rem;
      color: #707a83;
      padding: 0.25rem;
    }
    h2 {
      font-size: 2rem;
    }
    p {
      margin-top: 1rem;
      font-weight: 700;
      color: #707a83;
      display: flex;
      align-items: center;
    }
    a {
      color: #2081e2;
    }
    &__box {
      margin-top: 1rem;
      width: 100%;
      max-width: 500px;
      display: flex;
      border: 1px solid #e5e8eb;
      border-radius: 0.5rem;
      overflow: hidden;
      div {
        flex: 1;
        padding: 1rem 2rem;
        &:not(:last-child) {
          border-right: 1px solid #e5e8eb;
        }
        h4 {
          font-size: 1.2rem;
        }
        p {
          font-size: 0.9rem;
          color: #707a83;
        }
      }
    }
  }
  .description {
    margin-top: 2rem !important;
    color: #707a83;
    font-weight: 600;
    line-height: 2;
  }
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
    p {
      margin-top: 0.5rem;
    }
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
