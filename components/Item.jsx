import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { FaEthereum, FaRegHeart } from "react-icons/fa";
import { MdAccessTimeFilled, MdVerified } from "react-icons/md";

export default function Item({
  to,
  image,
  title,
  user,
  price,
  lastPrice,
  daysLeft,
  heart,
  isVerified,
  isFavorite,
}) {
  return (
    <StyledItem>
      <Link href={to} passHref>
        <a className="item">
          <Image
            src={image}
            alt={title}
            width={200}
            height={200}
            layout="responsive"
          />
          <div className="item__details">
            <div className="item__flex">
              <div className="item__flex__left">
                <p className="item__details__user">
                  {user} {isVerified && <MdVerified size={12} />}
                </p>
                <p className="item__details__title">{title}</p>
              </div>
              <div className="item__flex__right">
                <p className="item__details__price">
                  Price
                  <span>
                    <FaEthereum size={16} color="#8247E5" />
                    {price}
                  </span>
                </p>
                {lastPrice && (
                  <p className="item__details__last">
                    Last{" "}
                    <span>
                      <FaEthereum size={12} color="#8247E5" /> {lastPrice}
                    </span>
                  </p>
                )}
                {daysLeft && (
                  <p className="item__details__time">
                    <MdAccessTimeFilled size={12} /> {daysLeft}{" "}
                    {daysLeft > 1 ? "days" : "day"} left
                  </p>
                )}
              </div>
            </div>
          </div>
          {heart && (
            <div className="item__action">
              <FaRegHeart
                size={16}
                color={isFavorite ? "#EB5757" : "#707a83"}
              />
              <p>{heart}</p>
            </div>
          )}
        </a>
      </Link>
    </StyledItem>
  );
}

const StyledItem = styled.div`
  display: block;
  border: 1px solid #e5e8eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  a {
    text-decoration: none;
  }
  img {
    width: 100%;
    height: 100%;
    max-height: 200px;
    object-fit: cover;
    object-position: center;
  }
  .item {
    &__flex {
      display: flex;
      justify-content: space-between;
    }
    &__details {
      padding: 1rem;
      box-shadow: 0 8px 12px -8px rgba(0, 0, 0, 0.1);
      &__user {
        font-size: 0.7rem;
        color: #707a83;
        font-weight: 600;
        display: flex;
        align-items: center;
        svg {
          margin-left: 0.25rem;
          color: #2081e2;
        }
      }
      &__title {
        font-size: 0.9rem;
        font-weight: 700;
        margin-top: 0.25rem;
      }
      &__price {
        font-size: 0.7rem;
        text-align: right;
        color: #707a83;
        font-weight: 600;
        span {
          margin-top: 0.25rem;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: #000000;
          svg {
            margin-right: 0.25rem;
          }
        }
      }
      &__last {
        margin-top: 0.25rem;
        font-size: 0.7rem;
        color: #707a83;
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        span {
          margin-left: 0.25rem;
          color: #000000;
        }
      }
      &__time {
        margin-top: 0.25rem;
        font-size: 0.7rem;
        color: #707a83;
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        svg {
          margin-right: 0.25rem;
        }
      }
    }
    &__action {
      border-top: 1px solid #e5e8eb;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0.5rem 1rem;
      p {
        margin-left: 0.5rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: #707a83;
      }
    }
  }
  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;
