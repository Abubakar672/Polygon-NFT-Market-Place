import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";
import { MdSearch, MdVerified } from "react-icons/md";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <SearchBarWrapper>
      <StyledSearchBar onSubmit={(e) => e.preventDefault()}>
        <MdSearch size={24} />
        <input
          type="text"
          placeholder="Type Something"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </StyledSearchBar>
      <Suggestions search={search}>
        <h4>Suggestions Block for: {search}</h4>
        <Link href="/" passHref>
          <a>
            <Image
              src="https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
              alt="avatar"
              width={32}
              height={32}
            />
            <span>{search}</span>
            <MdVerified size={16} />
          </a>
        </Link>
        <Link href="/" passHref>
          <a>
            <Image
              src="https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
              alt="avatar"
              width={32}
              height={32}
            />
            <span>{search}</span>
            <MdVerified size={16} />
          </a>
        </Link>
        <Link href="/" passHref>
          <a>
            <Image
              src="https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
              alt="avatar"
              width={32}
              height={32}
            />
            <span>{search}</span>
            <MdVerified size={16} />
          </a>
        </Link>
      </Suggestions>
    </SearchBarWrapper>
  );
}

const SearchBarWrapper = styled.div`
  width: 100%;
  max-width: 768px;
  position: relative;
`;

const StyledSearchBar = styled.form`
  display: block;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e5e8eb;
  position: relative;
  overflow: hidden;
  padding-left: 2rem;
  svg {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: #707a83;
  }
  input {
    width: 100%;
    height: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #000000;
    border: none;
    &::placeholder {
      color: #8a939b;
    }
    &:focus {
      outline: none;
    }
  }
  &:focus-within {
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  }
`;

const Suggestions = styled.div`
  position: absolute;
  z-index: 99;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e8eb;
  opacity: ${(props) => (props.search ? 1 : 0)};
  pointer-events: ${(props) => (props.search ? "all" : "none")};
  transition: all 0.7s ease;
  h4 {
    font-size: 0.8rem;
    color: #707a83;
    padding: 1rem 2rem;
  }
  a {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-top: 1px solid #e5e8eb;
    padding: 1rem 2rem;
    /* gap: 1rem; */
    transition: all 0.3s ease;
    img {
      display: inline-block;
      border-radius: 50%;
    }
    span {
      margin: 0 0.5rem 0 1rem;
    }
    svg {
      color: #2081e2;
    }
    &:hover {
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15);
    }
    &:not(:last-child) {
      border-bottom: 1px solid #e5e8eb;
    }
  }
`;
