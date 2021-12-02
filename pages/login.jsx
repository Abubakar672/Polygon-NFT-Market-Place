import styled from "styled-components";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Link from "next/link";

export default function Login() {
  const [err, setErr] = useState("Log In");
  const [walletId, setWalletId] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setWalletId("123456789");
    }, 5000);
  }, []);

  return (
    <StyledLogin>
      <div className="container">
        <div className="flex-between">
          <h2>Log In</h2>
          <button>{walletId ? "Wallet Connected" : "Connect Wallet"}</button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Wallet ID
            <input
              type="text"
              placeholder="Wallet ID - Please Connect Metamask"
              value={walletId}
              required
              disabled
            />
          </label>
          <div
            style={{
              opacity: walletId ? 1 : 0.5,
              pointerEvents: walletId ? "all" : "none",
            }}
          >
            <Button type="submit" primary>
              {err}
            </Button>
          </div>
        </form>
        <Link href="/signup" passhref>
          <a>Don{"'"}t have an account? Sign Up</a>
        </Link>
      </div>
    </StyledLogin>
  );
}

const StyledLogin = styled.section`
  padding: 8rem 2rem;
  .container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      color: #2081e2;
      background: transparent;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
  }
  h2 {
    font-size: 2rem;
    /* color: #707a83; */
  }
  a {
    color: #707a83;
    font-size: 0.9rem;
    font-weight: 600;
  }
  form {
    margin-top: 2rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    div {
      button {
        width: 100%;
      }
    }
    input {
      padding: 0.8rem 1.2rem;
      width: 100%;
      border: 2px solid #ccc;
      border-radius: 0.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }
    label {
      font-weight: 700;
      color: inherit;
      font-size: 0.9rem;
    }
  }
  a {
    display: block;
    margin-top: 2rem;
    text-align: center;
    &:hover {
      text-decoration: underline;
    }
  }
`;
