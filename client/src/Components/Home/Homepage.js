import React, { useEffect, useState } from "react";
import "./Homepage.scss";
import { ethers } from "ethers";
import SignUp from "../Auth/SignUp";
import { PiUserCircle } from "react-icons/pi";
import DeID from "../../artifacts/contracts/DeID.sol/DeID.json";
import UserPage from "./UserPage";
import CompanyPage from "./CompanyPage";
import { truncateAddressNavbar } from "../Helpers/truncateAddress";
import Notifications from "../Cards/Notifications";
import Loader from "../Helpers/Loader";
import Logo from "../Cards/Logo";
import Push from "../Cards/Push";
import "./LandingPage.scss";
const Homepage = ({ setconnected }) => {
  const [signers, setsigners] = useState(null);
  const [connect, setconnect] = useState(false);
  const [provider, setprovider] = useState(null);
  const [accounts, setaccounts] = useState(null);
  const [contract, setcontract] = useState(null);
  const [isuser, setisuser] = useState(false);
  const [folders, setfolders] = useState(null);
  const [userDetails, setuserDetails] = useState(null);
  const [registered, setregistered] = useState(true);
  const [fetched, setfetched] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userAlice, setuserAlice] = useState(null);

  const connectFetch = async () => {
    setLoader(true);
    const loadProvider = async (provider) => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          loadProvider(provider);
        });
        window.ethereum.on("accountsChanged", () => {
          loadProvider(provider);
        });
        const { ethereum } = window;
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13882" }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            // Do something
            window.ethereum
              .request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x13882",
                    chainName: "Polygon",
                    nativeCurrency: {
                      name: "Amoy",
                      symbol: "MATIC",
                      decimals: 18,
                    },
                    rpcUrls: ["https://rpc-amoy.polygon.technology"],
                    blockExplorerUrls: ["https://www.oklink.com/amoy"],
                  },
                ],
              })
              .catch((error) => {});
          }
        }
        await provider.send("eth_requestAccounts", []);
        console.log("Provider", provider);
        const signer = provider.getSigner();
        setsigners(signer);
        const address = await signer.getAddress();
        setaccounts(address);
        let contractAddress = "0xA7dD5FCE507A4b6F0a24aBdCB169DaA023746C36"; //amoy
        //0x7492502792E8B8efE1503DAE8fa5913a008F5934 latest mumbai
        //0x196d4119944CD005AD917466B8e2e2Ec018FA547 fujin testnet
        const contractInstance = new ethers.Contract(
          contractAddress,
          DeID.abi,
          signer
        );
        setcontract(contractInstance);
        console.log("Contract", contractInstance);
        setprovider(provider);
        setconnect(true);
        setconnected(true);
      } else {
        console.error("MetaMask not Installed");
      }
    };
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await loadProvider(provider);
    } catch (error) {
      console.error("MetaMask not Installed");
    }
  };
  const registerPush = async () => {
    console.log("RegisterPush", signers);
    try {
    } catch (error) {
      console.log("Error", error);
    }
  };
  const checkRegistered = async () => {
    try {
      const res = await contract.ifRegistered();
      console.log("Response", res);
      const mssg = JSON.parse(JSON.stringify(res));
      var val = parseInt(mssg.hex, 16);
      console.log("time", val);
      setLoader(false);
      console.log("hereat val-0");
      if (val === 0) {
        const userData = await contract.userDetails();
        console.log("Userdata", userData);
        setuserDetails(userData);
        setfolders(userData.Folders);
        setfetched(true);
        setisuser(true);
        setregistered(true);
        registerPush();
      } else if (val === 1) {
        const userData = await contract.companyDetails(accounts);
        setuserDetails(userData);
        setfetched(true);
        registerPush();
        setregistered(true);
      } else {
        console.log("Not Registered");
        setregistered(false);
      }
    } catch (error) {
      console.log("Not Registered", error);
      setregistered(false);
    }
  };
  useEffect(() => {
    connect && checkRegistered();
  }, [contract, provider]);
  const [colorChange, setColorchange] = useState(false);
  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setColorchange(true);
      console.log("Chagned color");
    } else {
      setColorchange(false);
      console.log("Chagned back color");
    }
  };
  // window.addEventListener('scroll', changeNavbarColor);
  //Use effect to get the logged in details, to accordingly load user and company homepage
  return (
    <div>
      {connect ? (
        <>
          <div
            className="logo"
            style={{
              width: "auto",
              marginTop: "3rem",
              paddingLeft: "4rem",
              height: "6rem",
              display: "flex",
            }}
          >
            <Logo />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                paddingLeft: "2.8rem",
                fontSize: "30px",
                // fontFamily: 'serrif',
                fontWeight: "600",
              }}
            >
              InfoSentinel
            </div>
          </div>
          <div className="navbar ">
            <div className={`navbar__center`}>
              <div
                style={{
                  fontSize: "16px",
                  display: "flex",
                  gap: "3rem",
                }}
              >
                {isuser ? (
                  <>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      My folders
                    </button>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 500, behavior: "smooth" })
                      }
                    >
                      Requests
                    </button>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 1800, behavior: "smooth" })
                      }
                    >
                      History
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Active users
                    </button>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 500, behavior: "smooth" })
                      }
                    >
                      Requests
                    </button>
                    {/* <button onClick={()=>window.scrollTo({top: 1800, behavior: "smooth"})}>History</button> */}
                  </>
                )}
              </div>
              <div
                className={`${" transition ease-in-out delay-150"} navbar__right`}
                style={{}}
              >
                {fetched && isuser && (
                  <div className="navbar__left">
                    {userDetails?.Image.length === 0 ? (
                      <PiUserCircle size={30} />
                    ) : (
                      <img
                        src={userDetails?.Image}
                        alt="Profile"
                        className="max-h-[30px]"
                      />
                    )}
                  </div>
                )}
                {connect && fetched ? (
                  <>
                    <button
                      className="truncate max-w-[250px] flex navbar__right--connect"
                      style={{}}
                    >
                      accounts : {truncateAddressNavbar(accounts)}
                    </button>
                    <button className="navbar__right--notify">
                      <Notifications userAlice={userAlice} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectFetch}
                    className="navbar__right--connect"
                    style={{}}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            {}
          </div>
          {registered ? (
            <div style={{ overflowY: "scroll" }}>
              {!loader ? (
                <>
                  {isuser ? (
                    <UserPage
                      fetched={fetched}
                      contract={contract}
                      folders={folders}
                      userAlice={userAlice}
                      account={accounts}
                      connect={connect}
                    />
                  ) : (
                    <CompanyPage
                      userDetails={userDetails}
                      userAlice={userAlice}
                      fetched={fetched}
                      contract={contract}
                      connect={connect}
                    />
                  )}
                </>
              ) : (
                <div>
                  <Loader />
                </div>
              )}
            </div>
          ) : (
            <SignUp
              accounts={accounts}
              contract={contract}
              provider={provider}
            />
          )}
        </>
      ) : (
        <>
          <div className="navbar ">
            <div className={`navbar__center`}>
              <div
                style={{
                  fontSize: "16px",
                  display: "flex",
                  gap: "3rem",
                }}
              >
                {isuser ? (
                  <>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      My folders
                    </button>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 500, behavior: "smooth" })
                      }
                    >
                      Requests
                    </button>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 1800, behavior: "smooth" })
                      }
                    >
                      History
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Active users
                    </button>
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 500, behavior: "smooth" })
                      }
                    >
                      Requests
                    </button>
                    {/* <button onClick={()=>window.scrollTo({top: 1800, behavior: "smooth"})}>History</button> */}
                  </>
                )}
              </div>
              <div
                className={`${" transition ease-in-out delay-150"} navbar__right`}
                style={{}}
              >
                {fetched && isuser && (
                  <div className="navbar__left">
                    {userDetails?.Image.length === 0 ? (
                      <PiUserCircle size={30} />
                    ) : (
                      <img
                        src={userDetails?.Image}
                        alt="Profile"
                        className="max-h-[30px]"
                      />
                    )}
                  </div>
                )}
                {connect && fetched ? (
                  <>
                    <button
                      className="truncate max-w-[250px] flex navbar__right--connect"
                      style={{}}
                    >
                      accounts : {truncateAddressNavbar(accounts)}
                    </button>
                    <button className="navbar__right--notify">
                      <Notifications userAlice={userAlice} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectFetch}
                    className="navbar__right--connect"
                    style={{}}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            {}
          </div>
          <div className="container">
            <div
              className="logo"
              style={{
                width: "auto",
                marginTop: "3rem",
                paddingLeft: "4rem",
                height: "6rem",
                display: "flex",
              }}
            >
              <Logo />
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  paddingLeft: "2.8rem",
                  fontSize: "30px",
                  // fontFamily: 'serrif',
                  fontWeight: "600",
                }}
              >
                InfoSentinel
              </div>
            </div>
            <div className="container__content">
              <div className="container__content__text">
                <div className="header">
                  Sentinals of Your Confidentiality: Protecting Your Important
                  Documents
                </div>
                <div className="summary">
                  Take control of the privacy of your precious documents by
                  using InfoSentinel, ensuring that only those you've granted
                  access can use them.
                </div>
              </div>
              <div className="container__content__anim"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Homepage;
