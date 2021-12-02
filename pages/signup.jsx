import styled from "styled-components";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Link from "next/link";

export default function Signup() {
  const [err, setErr] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [walletId, setWalletId] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setWalletId("123456789");
    }, 5000);
  }, []);
  return (
    <StyledSignup>
      <div className="container">
        <div className="flex-between">
          <h2>Sign Up</h2>
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
          <label>
            Email
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Username
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
        <Link href="/login" passhref>
          <a>Already have an account? Log In</a>
        </Link>
      </div>
    </StyledSignup>
  );
}

const StyledSignup = styled.section`
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
