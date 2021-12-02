import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import { MdAccountBalanceWallet, MdLogout, MdRefresh } from "react-icons/md";
import Button from "./Button";
// import Web3Modal from "web3modal"
import { ethers } from "ethers";
import useAuth from "../hooks/useAuth";

export default function Nav() {
  let user = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [vw, setVw] = useState(2000);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [userAddress, setUserAddress] = useState(null);
  //Test state
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect(()=>{
  //   window.ethereum.on('accountsChanged', function (accounts) {
  //     window.location.reload();
  //   })
  // },[])
  useEffect(() => {
    setVw(window.innerWidth);
    window.addEventListener("resize", () => {
      setVw(window.innerWidth);
    });
  }, []);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          user.handleLogin(result[0]);
          // localStorage.setItem("isLoggedIn", true);
          // setIsLoggedIn(true);
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
          // getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  // const getAccountBalance = (account) => {
  //   window.ethereum
  //     .request({ method: "eth_getBalance", params: [account, "latest"] })
  //     .then((balance) => {
  //       setUserBalance(ethers.utils.formatEther(balance));
  //     })
  //     .catch((error) => {
  //       setErrorMessage(error.message);
  //     });
  // };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // const logout = async () => {
  //   // await web3Modal.clearCachedProvider()
  //   localStorage.setItem("isLoggedIn", false);
  //   setIsLoggedIn(false);
  // };

  // listen for account changes
  // window.ethereum.on('accountsChanged', accountChangedHandler);

  // window.ethereum.on('chainChanged', chainChangedHandler);

  console.log("Addresss coming here 111111------------------>", defaultAccount);
  console.log("Balance is -------------->", userBalance);

  return (
    <StyledNav>
      <div className="home">
        <Link href="/" className="home">
          <a>
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <span>Mowsse</span>
          </a>
        </Link>
      </div>
      {vw > 768 ? (
        <div className="other">
          <SearchBar />
          <div className="other__links">
            <Link href="/explore">Explore</Link>

            {user.id ? (
              <>
                <Link href="/create">Create</Link>
              </>
            ) : null}
            <Link href="/user/self">Profile</Link>
            {/* <Link href="/login">Log In</Link> */}
          </div>
        </div>
      ) : (
        <Menu>
          <Btn
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <span
              style={{
                transform: isMenuOpen
                  ? "rotateZ(45deg) translateY(-50%)"
                  : "rotateZ(0deg)",
                top: isMenuOpen ? "50%" : "0",
              }}
            ></span>
            <span style={{ opacity: isMenuOpen ? 0 : 1 }}></span>
            <span
              style={{
                transform: isMenuOpen
                  ? "rotateZ(-45deg) translateY(50%)"
                  : "rotateZ(0deg)",
                bottom: isMenuOpen ? "50%" : "0",
              }}
            ></span>
          </Btn>
          <MenuItems
            style={{
              opacity: isMenuOpen ? 1 : 0,
              pointerEvents: isMenuOpen ? "all" : "none",
            }}
          >
            <SearchBar />
            <Link href="/explore" passHref>
              <a onClick={() => setIsMenuOpen(!isMenuOpen)}>Explore</a>
            </Link>
            <Link href="/create" passHref>
              <a onClick={() => setIsMenuOpen(!isMenuOpen)}>Create</a>
            </Link>
            <Link href="/user/self">
              <a onClick={() => setIsMenuOpen(!isMenuOpen)}>Profile</a>
            </Link>
            {/* <Link href="/login">
              <a onClick={() => setIsMenuOpen(!isMenuOpen)}>Log In</a>
              <Button onClick={connectWalletHandler}></Button>
            </Link> */}
          </MenuItems>
        </Menu>
      )}
      <button
        className="connect-slider-btn"
        title="Connect Wallet"
        onClick={() => setIsConnectOpen(!isConnectOpen)}
      >
        <MdAccountBalanceWallet size={24} />
      </button>
      <WalletConnect
        style={{
          transform: isConnectOpen ? "translateX(0%)" : "translateX(100%)",
        }}
      >
        <div className="header">
          <div>
            <Image
              src={"/placeholder.png"}
              width={32}
              height={32}
              alt="user image"
            ></Image>
            <h3>My Wallet</h3>
          </div>
          {user.id && (
            <div>
              <p>
                {user.id.substr(0, 7)}...{user.id.slice(-5)}
              </p>
              {/* <button title="Log Out" onClick={() => setIsLoggedIn(false)}>
                <MdLogout size={24} onClick={logout} />
              </button> */}
            </div>
          )}
        </div>
        <div className="body">
          {user.id && (
            <div className="balance">
              <div className="balance__inner">
                {/* <button
                  title="Refresh Funds"
                  className="balance__inner__refresh"
                >
                  <MdRefresh size={24} />
                </button> */}
                <h4>Balance</h4>
                <p>{user.balance}</p>
              </div>
              {/* <Button primary>Add Funds</Button> */}
            </div>
          )}
          {!user.id && (
            <div className="connect">
              <p>
                Connect with one of our available wallet info providers or
                create a new one.
              </p>
              <div className="connect__inner">
                <button onClick={connectWalletHandler}>
                  <Image
                    src="/metamask.webp"
                    width={24}
                    height={24}
                    alt="metamask logo"
                  ></Image>{" "}
                  <span>Metamask</span>
                </button>
                <button>
                  <Image
                    src="/coinbase.webp"
                    width={24}
                    height={24}
                    alt="coinbase logo"
                  ></Image>{" "}
                  <span>Coinbase</span>
                </button>
                <button>
                  <Image
                    src="/walletconnect.webp"
                    width={24}
                    height={24}
                    alt="walletconnect logo"
                  ></Image>{" "}
                  <span>WalletConnect</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </WalletConnect>
    </StyledNav>
  );
}

const WalletConnect = styled.div`
  position: absolute;
  top: 100%;
  border-top: 2px solid #2081e2;
  right: 0;
  transform: translateX(0%);
  z-index: 1;
  width: 100%;
  max-width: 375px;
  height: 100vh;
  background: #fff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  .header {
    border-bottom: 1px solid #e6e6e6;
    padding: 1.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      h3 {
        display: inline-block;
        font-size: 1rem;
        margin-left: 0.5rem;
      }
    }
    img {
      border-radius: 50%;
      object-fit: cover;
    }
    p {
      font-size: 0.9rem;
      font-weight: 700;
      color: #707a83;
    }
    svg {
      color: #707a83;
      margin-left: 0.5rem;
    }
    button {
      white-space: nowrap;
      font-weight: 700;
      background-color: transparent;
      border: none;
      font-size: 1rem;
      transition: all 0.3s ease;
      display: grid;
      place-items: center;
      cursor: pointer;
      &:hover {
        svg {
          color: #2081e2;
        }
      }
    }
  }
  .connect {
    p {
      font-size: 0.9rem;
    }
    &__inner {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      border: 1px solid #e6e6e6;
      border-radius: 0.5rem;
      button {
        display: flex;
        align-items: center;
        background-color: transparent;
        font-size: 0.9rem;
        font-weight: 700;
        padding: 0.8rem 1rem;
        text-align: left;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        span {
          margin-left: 1rem;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #e6e6e6;
        }
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
  .body {
    padding: 1.5rem 1rem;
    .balance {
      border: 1px solid #e6e6e6;
      border-radius: 0.5rem;
      overflow: hidden;
      button {
        width: 100%;
        border-radius: 0;
      }
      &__inner {
        position: relative;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        &__refresh {
          position: absolute;
          width: 2rem !important;
          height: 2rem;
          top: 0.5rem;
          right: 0.5rem;
          background-color: transparent;
          border: none;
          color: #707a83;
          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            color: #2081e2;
          }
        }
        h4 {
          color: #707a83;
          font-size: 0.9rem;
        }
        p {
          font-size: 1.2rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }
      }
    }
  }
`;

const StyledNav = styled.nav`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 99;
  background-color: #fff;
  img {
    object-fit: contain;
    object-position: center;
  }
  .connect-slider-btn {
    background: transparent;
    border: none;
    white-space: nowrap;
    font-weight: 700;
    margin-left: 2rem;
    font-size: 1rem;
    color: #707a83;
    transition: all 0.3s ease;
    display: grid;
    place-items: center;
    cursor: pointer;
    &:hover {
      color: #2081e2;
    }
  }
  .home {
    flex: 1;
    @media (max-width: 768px) {
      flex: none;
      margin-right: auto;
    }
    a {
      font-weight: 700;
      font-size: 1.2rem;
      color: #2081e2;
      display: flex;
      align-items: center;
      span {
        margin-left: 0.5rem;
      }
    }
  }
  .other {
    flex: 2;
    display: flex;
    align-items: center;
    @media (max-width: 768px) {
      display: none;
    }
    &__links {
      display: flex;
      align-items: center;
      a,
      button {
        white-space: nowrap;
        font-weight: 700;
        margin-left: 2rem;
        font-size: 1rem;
        color: #707a83;
        transition: all 0.3s ease;
        display: grid;
        place-items: center;
        cursor: pointer;
        &:hover {
          color: #2081e2;
        }
      }
      button {
        background: transparent;
        border: none;
      }
    }
  }
`;

const Menu = styled.span`
  display: inline-block;
  /* position: relative; */
`;

const Btn = styled.span`
  display: inline-block;
  position: relative;
  height: 1rem;
  margin-top: 3px;
  z-index: 99;
  cursor: pointer;
  span {
    position: absolute;
    display: inline-block;
    height: 2px;
    width: 1.5rem;
    /* border-radius: 20rem; */
    background-color: #707a83;
    transform-origin: center;
    transition: all 0.3s ease;
    &:nth-child(1) {
      top: 0;
      right: 0;
    }
    &:nth-child(2) {
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
    &:nth-child(3) {
      bottom: 0;
      right: 0;
    }
  }
`;

const MenuItems = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: auto;
  background-color: #ffffff;
  color: #000000;
  z-index: 98;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  transition: all 0.7s ease;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  @supports not (gap: 1rem) {
    margin: -0.5rem;
    & > * {
      margin: 0.5rem;
    }
  }
  a {
    font-weight: 700;
    font-size: 1rem;
    color: #707a83;
    transition: all 0.3s ease;
    &:hover {
      color: #2081e2;
    }
  }
`;
