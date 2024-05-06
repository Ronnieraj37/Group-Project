import React, { useEffect, useState } from "react";
import Documents from "./Documents";
import Folder from "../Cards/Folder";
import { LuScanLine } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./CompanyPage.scss";
import CompanyCard from "../Cards/CompanyCard";
import QrReader from "react-qr-scanner";
import Modal from "../Helpers/Modal";
const delay = 100;
const CompanyPage = ({
  contract,
  userAlice,
  userDetails,
  fetched,
  folders,
  connect,
}) => {
  const [folderclosed, setfolderclosed] = useState(true);
  const [docs, setdocs] = useState([]);
  const [val, setval] = useState(0);
  const [scan, setScan] = useState(false);
  const [requested, setrequested] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [result, setResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReqModalOpen, setisReqModalOpen] = useState(false);
  const [userContent, setuserContent] = useState("");
  const [bg, setbg] = useState("");

  const openReqModal = async (address) => {
    const result = await documentAccessed(address);
    console.log("Filesigned", result);
    if (result) {
      setisReqModalOpen(true);
    } else {
      closeReqModal();
    }
  };
  const closeReqModal = () => {
    setisReqModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInputAddress("");
    setrequested(false);
  };
  const [openDocs, setopenDocs] = useState(false);
  const [users, setusers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await contract.returnUsersData();
      console.log("Here", res);
      getDocs(res);
      setusers(res);
    } catch (error) {}
  };
  const getDocs = async (res) => {
    var docs = [];
    try {
      for (var i = 0; i < res.length; i++) {
        const doc = await contract.returnUserDocs(res[i].Address);
        docs.push(doc);
      }
      console.log("docs", docs);
    } catch (error) {
      console.log("Error", error);
    }
    setdocs(docs);
  };
  const openFolder = async (i) => {
    try {
      // const res = await contract.returnDocs(i);
      // console.log(res);
      // setval(i);
      // setdocs(res);
      // setfolderclosed(false);
    } catch (error) {
      console.log("Error");
    }
  };
  const documentAccessed = async (address) => {
    try {
      await userAlice.channel.send([`eip155:5:${address}`], {
        notification: {
          title: `Your Files Were Accessed by ${userDetails.Name}`,
          body: "Tap to Open ",
        },
        payload: {
          // trigger notification for a setting
          index: {
            // index of the notification.
            index: 2,
          },
        },
      });
      return true;
    } catch (error) {
      console.log("erro", error);
      return false;
    }
  };
  const openScanner = () => {
    setScan(true);
    setBgColor("white");
  };
  const handleScan = (data) => {
    if (data !== null) {
      setInputAddress(data.text);
      setrequested(true);
      console.log("Data", data.text);
    }
  };
  const handleError = (err) => {
    console.log(err);
  };
  const setBgColor = (index) => {
    if (index % 3 === 0) {
      return "linear-gradient(to bottom, #fa9f88, #fa4582ff)";
    } else if (index % 3 === 1) {
      return "linear-gradient(to bottom, #f4c402, #f56701)";
    } else {
      return "linear-gradient(to bottom, #87efa2, #0bb79a)";
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      {!isModalOpen && connect && (
        <div className="company_qr">
          <button onClick={openModal}>
            <p>
              Scan QR
              <LuScanLine
                style={{
                  display: "inline",
                  transform: "scale(1.6) translateY(-1px)",
                  marginLeft: "15px",
                }}
              />
            </p>
          </button>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        bg={
          "linear-gradient(to bottom, rgb(234, 234, 234), rgb(179, 179, 179))"
        }
      >
        {!requested ? (
          <div>
            <QrReader
              style={{
                height: 300,
              }}
              delay={delay}
              // style={previewStyle}
              onError={handleError}
              onScan={handleScan}
              facingMode="rear"
            />
            <input
              type="text"
              placeholder="Or enter wallet address"
              onChange={(e) => setInputAddress(e.target.value)}
              value={inputAddress}
              style={{
                marginTop: "2.5rem",
                borderRadius: "100px",
                width: "100%",
                color: "black",
                fontWeight: "400",
              }}
            />
            {inputAddress && (
              <button
                onClick={() => {
                  setResult(inputAddress);
                  setrequested(true);
                  console.log("Address", inputAddress);
                }}
                style={{
                  display: "inline",
                  position: "absolute",
                  right: "2.5rem",
                  bottom: "2.4rem",
                  transform: "scale(1.4)",
                  color: "black",
                }}
              >
                <BsArrowRight />
              </button>
            )}
          </div>
        ) : (
          <>
            <CompanyCard
              closeModal={closeModal}
              contract={contract}
              inputAddress={inputAddress}
            />
          </>
        )}
      </Modal>
      <Modal isOpen={isReqModalOpen} closeModal={closeReqModal} bg={bg}>
        {userContent}
      </Modal>
      {folderclosed ? (
        <div>
          {fetched && (
            <div className="company_row">
              <div className="company_row__1">
                <div className="company_row__header">
                  <div className="company_row__title"></div>
                </div>
                <div className="company_row__sections"></div>
                {/* <div className="row__sections"></div> */}
              </div>
              <div className="company_row__2">
                <div className="company_row__header">
                  <div className="company_row__title">Active Users</div>
                  {/* <div className="row__title">Active Users</div> */}
                  <button className="company_row__btn">
                    View all <span>&rarr;</span>
                  </button>
                </div>
                <div className="company_row__sections">
                  {users.map((user, index) => {
                    return (
                      <div
                        className="company_column"
                        key={index}
                        style={{ backgroundImage: `${setBgColor(index)}` }}
                        onClick={() => {
                          openReqModal(user.Address);
                          // documentAccessed();
                          setbg(setBgColor(index));
                          var phone;
                          if (user.Phone.length !== 0) {
                            const mssg = JSON.parse(JSON.stringify(user.Phone));
                            phone = parseInt(mssg.hex, 16);
                          }
                          setuserContent(
                            <div
                              className="column__fields"
                              style={{ border: "none", color: "black" }}
                            >
                              <div className="popup">
                                <div className="popup__up">
                                  {/* <img src='' alt=".image" className="image" style={{borderRadius: '4rem'}}/> */}
                                  <div className="image">
                                    <AiOutlineUser size={105} />
                                  </div>
                                  <div
                                    style={{ display: "flex" }}
                                    className="details"
                                  >
                                    {user.Name.length !== 0 && (
                                      <div>{user.Name}</div>
                                    )}
                                    {user.Image.length !== 0 && (
                                      <div>{user.Image}</div>
                                    )}
                                    {user.DOB.length !== 0 && (
                                      <div>{user.DOB}</div>
                                    )}
                                    {user.Phone.length !== 0 && (
                                      <div>{phone}</div>
                                    )}
                                  </div>
                                </div>
                                <div className=" popup__down ">
                                  <div>Files</div>
                                  <div className="grid grid-cols-3  overflow-auto">
                                    {docs[index].map((doc, key) => {
                                      return (
                                        <img
                                          className="max-w-[120px] max-h-[80px] m-3"
                                          src={doc.Hash}
                                          alt="document"
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      >
                        <h1 style={{ textAlign: "center" }}>
                          {user === null ? <p>User</p> : <p>{user.Name}</p>}
                        </h1>
                        <div
                          style={{
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <AiOutlineUser size={200} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="company_row__2">
                <div className="company_row__header">
                  <div className="company_row__title">Previous Users</div>
                  {/* <div className="row__title">Active Users</div> */}
                  <button className="company_row__btn">
                    View all <span>&rarr;</span>
                  </button>
                </div>
                <div className="company_row__sections">
                  {users.map((user, index) => {
                    return (
                      <div
                        className="company_column"
                        key={index}
                        style={{ backgroundImage: `${setBgColor(index)}` }}
                      >
                        <h1 style={{ textAlign: "center" }}>
                          {user === null ? (
                            <p>User</p>
                          ) : (
                            <p className="text-4xl my-4 underline-dark-50">
                              {user.Name}
                            </p>
                          )}
                        </h1>
                        <hr />
                        <div
                          style={{
                            textAlign: "center",
                            height: "80%",
                            display: "flex",
                            justifyContent: "space-around",
                            flexDirection: "column",
                          }}
                        >
                          <div style={{ backgroundColor: "rgba(white, .3)" }}>
                            Name
                          </div>
                          <div style={{ backgroundColor: "rgba(white, .3)" }}>
                            Image
                          </div>
                          <div style={{ backgroundColor: "rgba(white, .3)" }}>
                            DOB
                          </div>
                          <span>Folders:</span>
                          <div style={{ backgroundColor: "rgba(white, .3)" }}>
                            Medical
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* <div className="company_row__3">
                <div className="company_row__header">
                  <div className="company_row__title">History</div>
                  <button className="company_row__btn">
                    View all <span>&rarr;</span>
                  </button>
                </div>
                <div className="company_row__sections">
                  <div className="column"></div>
                  <div className="column"></div>
                  <div className="column"></div>
                </div>
              </div> */}
            </div>
          )}
        </div>
      ) : (
        <Documents
          val={val}
          setfolderclosed={setfolderclosed}
          name={folders[val]}
          contract={contract}
          docs={docs}
        />
      )}
    </div>
  );
};

export default CompanyPage;
