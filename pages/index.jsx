import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import Button from "../components/Button";
import { useState, useEffect } from "react";
//ICON
import { BsTextLeft } from "react-icons/bs";
import useAuth from "../hooks/useAuth";

export default function Home() {
  let user = useAuth();

  return (
    <main>
      <Head>
        <title>Mowsse</title>
        <meta
          name="description"
          content="The world's first NFT marketplace created exclusively by creatives for creatives"
        />
      </Head>
      <StyledIntro>
        <div className="curtain"></div>
        <div className="container">
          <div className="left">
            <h1>Discover, collect and sell curated NFT{"'"}s</h1>
            <h2>The first marketplace by Creatives for Creatives</h2>
            <div className="cta">
              <Link href="/explore" passHref>
                <a>
                  <Button primary>Explore</Button>
                </a>
              </Link>
              {user.id && (
                <Link href="/create" passHref>
                  <a>
                    <Button>Create</Button>
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="right">
            <Link href="/asset/test" passHref>
              <a className="art">
                <Image
                  src="https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=581&q=80"
                  alt="nft"
                  layout="fill"
                />
                <h3>
                  <span>Artwork #1</span> by{" "}
                  <Link href="/user/test">User 1</Link>
                </h3>
              </a>
            </Link>
          </div>
        </div>
      </StyledIntro>
    </main>
  );
}

const StyledIntro = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem 2rem 2rem;
  background-image: url("https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=581&q=80");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  @media (max-width: 768px) {
    min-height: auto;
  }
  .curtain {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(5px);
    z-index: 1;
  }
  .container {
    min-height: 90vh;
    max-width: 1366px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 768px) {
      min-height: auto;
      flex-direction: column;
      padding-top: 2rem;
    }
  }
  .left,
  .right {
    position: relative;
    z-index: 2;
    flex: 1;
  }
  .left {
    margin-right: 2rem;
    h1 {
      font-size: 3rem;
    }
    h2 {
      margin-top: 1rem;
      font-weight: 400;
    }
  }
  .cta {
    margin-top: 2rem;
    button {
      margin-right: 1rem;
    }
  }
  .right {
    .art {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
      width: 100%;
      height: 60vh;
      display: block;
      overflow: hidden;
      border-radius: 1rem;
      position: relative;
      @media (max-width: 768px) {
        margin-top: 2rem;
        height: 50vh;
        width: calc(100vw - 4rem);
        background-color: red;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 2;
      }
      h3 {
        width: 100%;
        font-size: 1.5rem;
        background-color: #ffffff;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
        z-index: 10;
        font-weight: 400;
        color: #707a83;
        span {
          font-weight: 600;

          color: #000000;
        }
      }
      a {
        color: #2081e2;
        font-weight: 400;
      }
    }
  }
`;
