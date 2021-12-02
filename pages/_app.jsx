import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
//Components
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
//Context
import { AuthContext } from "../context";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [userState, setUserState] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [forceUI, setForceUI] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setUserState(result[0]);
        })
        .catch((error) => {
          setUserState(null);
        });
      if (userState) {
        window.ethereum
          .request({ method: "eth_getBalance", params: [userState, "latest"] })
          .then((balance) => {
            setUserBalance(ethers.utils.formatEther(balance));
          })
          .catch((error) => {
            setUserBalance("Could not get balance");
          });
      }
      if (userState) {
        fetch(`/api/userData/findUser?id=${userState.toLowerCase()}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              setProfileData(data.data);
            } else {
              fetch(`/api/userData/createUser?id=${userState.toLowerCase()}`)
                .then((res) => res.json())
                .then((data) => {
                  if (data.status === "success") {
                    setForceUI(!forceUI);
                  }
                })
                .catch((err) => {
                  console.log(err.message);
                });
            }
          })
          .catch((err) => console.log(err.message));
      }
    };
    checkAuth();
  }, [userState, forceUI]);

  const handleLogin = (v) => {
    setUserState(v);
  };

  const handleLogout = () => {
    setUserState(false);
  };

  return (
    <AuthContext.Provider
      value={{
        id: userState,
        balance: userBalance,
        profileData: profileData,
        handleLogin,
        handleLogout,
      }}
    >
      <header>
        <Nav />
        <NextNProgress
          color="#2081e2"
          startPosition={0.3}
          stopDelayMs={300}
          height={3}
          showOnShallow={true}
          options={{ easing: "ease", speed: 300, showSpinner: false }}
        />
      </header>
      <Component {...pageProps} />
      <Footer />
    </AuthContext.Provider>
  );
}

export default MyApp;
