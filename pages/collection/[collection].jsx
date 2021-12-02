import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import Item from "../../components/Item";

export default function Collection() {
  const router = useRouter();
  const { collection } = router.query;
  return (
    <main>
      <Head>
        <title>{collection} - Collection | Mowsse</title>
      </Head>
      <StyledCollection>
        <div className="cover">
          <Image
            src="https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="Cover"
            width="1000"
            height="1000"
            layout="fill"
          />
        </div>
        <div className="collection">
          <div className="dp">
            <Image
              src="https://images.unsplash.com/photo-1604077198996-4eb67c32f6a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"
              alt="Cover"
              width="200"
              height="200"
              layout="responsive"
            />
          </div>
          <div className="details">
            <h2>BitFoxes</h2>
            <p>
              Created by <Link href="/user/test">Bitfox</Link>
            </p>
            <div className="details__box">
              <div>
                <h4>123</h4>
                <p>items</p>
              </div>
              <div>
                <h4>123</h4>
                <p>items</p>
              </div>
              <div>
                <h4>123</h4>
                <p>items</p>
              </div>
              <div>
                <h4>123</h4>
                <p>items</p>
              </div>
            </div>
            <p className="description">
              Unique limited collection of wonderful foxes
            </p>
          </div>
        </div>
        <div className="grid">
          <Item
            to="/asset/Item 1"
            title="Item 1"
            user="Test User"
            isVerified
            price={1.2}
            lastPrice={1.8}
            heart={12}
            image="https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXJ0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          />
          <Item
            to="/asset/Item 2"
            title="Item 2"
            user="Test User"
            price={1.2}
            daysLeft={3}
            heart={3}
            isFavorite
            image="https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXJ0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          />
          <Item
            to="/asset/Item 1"
            title="Item 1"
            user="Test User"
            isVerified
            price={1.2}
            lastPrice={1.8}
            heart={12}
            image="https://images.unsplash.com/photo-1540408055539-b4dd7d0da12e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YXJ0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          />
          <Item
            to="/asset/Item 2"
            title="Item 2"
            user="Test User"
            price={1.2}
            daysLeft={3}
            heart={3}
            isFavorite
            image="https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8YXJ0fGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
          />
          <Item
            to="/asset/Item 1"
            title="Item 1"
            user="Test User"
            isVerified
            price={1.2}
            lastPrice={1.8}
            heart={12}
            image="https://images.unsplash.com/photo-1555580168-9fb9646a8a1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          />
          <Item
            to="/asset/Item 2"
            title="Item 2"
            user="Test User"
            price={1.2}
            daysLeft={3}
            heart={3}
            isFavorite
            image="https://images.unsplash.com/photo-1596120718374-028fba035262?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGFydHxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          />
          <Item
            to="/asset/Item 1"
            title="Item 1"
            user="Test User"
            isVerified
            price={1.2}
            lastPrice={1.8}
            heart={12}
            image="https://images.unsplash.com/photo-1489648022186-8f49310909a0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGFydHxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          />
          <Item
            to="/asset/Item 2"
            title="Item 2"
            user="Test User"
            price={1.2}
            daysLeft={3}
            heart={3}
            isFavorite
            image="https://images.unsplash.com/photo-1552765593-e48b46abe866?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGFydHxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          />
        </div>
      </StyledCollection>
    </main>
  );
}

const StyledCollection = styled.section`
  min-height: 100vh;
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
    h2 {
      font-size: 2rem;
    }
    p {
      margin-top: 1rem;
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
      overflow: auto;
      div {
        flex: 1;
        padding: 1rem 2rem;
        @media (max-width: 768px) {
          padding: 1rem 1rem;
        }
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
  }
  .grid {
    padding: 4rem 2rem;
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
