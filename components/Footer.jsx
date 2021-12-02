import styled from "styled-components";
import Button from "./Button";
import {
  FaTwitter,
  FaDiscord,
  FaInstagram,
  FaTelegramPlane,
} from "react-icons/fa";

export default function Footer() {
  return (
    <StyledFooter>
      <div className="container">
        <div className="footer-top">
          <div className="flex">
            <div>
              <h3>Ready to dive in?</h3>
              <p>
                Whether you{"'"}re a creative or collector, we have something
                for everyone. If you want to know more about NFT{"'"}s or you
                {"'"}re an artist that is interested in submitting pieces, join
                us via email below
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" required />
                <Button type="submit" primary>
                  Join
                </Button>
              </form>
            </div>
            <div>
              <h3>Join the community</h3>
              <div className="footer-links">
                {/* <a href="https://twitter.com">
                  <FaTwitter size={20} />
                </a> */}
                <a href="https://discord.gg">
                  <FaDiscord size={20} />
                </a>
                <a href="https://t.me/mowsse">
                  <FaTelegramPlane size={20} />
                </a>
                <a href="https://www.instagram.com/mowssehowsse">
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="flex">
            <div>
              <h3>Mowsse</h3>
              <p>
                The world’s first and largest digital marketplace for crypto
                collectibles and non-fungible tokens (NFTs). Buy, sell, and
                discover exclusive digital items.
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="copy">
        &copy; {new Date().getFullYear()} Mowsse. All rights reserved.
      </div>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  /* margin-top: 2rem; */
  box-shadow: 0 -20px 25px -5px rgba(0, 0, 0, 0.1),
    0 -10px 10px -5px rgba(0, 0, 0, 0.04);
  .container {
    max-width: 1366px;
    margin: 0 auto;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    @media (max-width: 1000px) {
      flex-direction: column;
    }
    div {
      /* flex: 1; */
      max-width: 500px;
    }
  }
  .footer {
    &-top {
      padding: 4rem 2rem;
      @media (max-width: 1000px) {
        padding: 4rem 2rem 2rem;
      }
      h3 {
        font-size: 1.5rem;
        color: #2081e2;
      }
      p {
        margin-top: 1rem;
        color: #707a83;
        font-weight: 600;
      }
    }
    &-links {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;

      flex-wrap: wrap;

      a {
        background-color: #2081e2;
        color: #fff;
        padding: 1rem;
        border-radius: 0.5rem;
        display: grid;
        place-items: center;
        &:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      }
    }
    &-bottom {
      padding: 0 2rem;
      h3 {
        font-size: 1.5rem;
        color: #2081e2;
      }
      p {
        margin-top: 1rem;
        color: #707a83;
        font-weight: 600;
      }
    }
  }
  .copy {
    margin-top: 4rem;
    @media (max-width: 1000px) {
      margin-top: 2rem;
    }
    padding: 1rem 2rem;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 600;
    background-color: #2081e2;
    color: #fff;
  }
  form {
    margin-top: 1rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    @media (max-width: 768px) {
      flex-direction: column;
    }
    input {
      flex: 1;
      padding: 0.8rem 1.2rem;
      border: 2px solid #2081e2;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: bold;
      transition: all 0.3s ease;
    }
  }
`;
