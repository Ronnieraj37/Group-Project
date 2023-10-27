import React, { useEffect, useState } from "react";
import Documents from "./Documents";
import Folder from "../Cards/Folder";
import {truncateAddressHistory} from '../Helpers/truncateAddress';
import './UserPage.scss'
import {MdQrCodeScanner} from 'react-icons/md';
import {LuCopy} from 'react-icons/lu';
import {LuCopyCheck} from 'react-icons/lu';
import Modal from "../Helpers/Modal";
import QRCode from 'react-qr-code';
import 'reactjs-popup/dist/index.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Loader from "../Helpers/Loader";
const UserPage = ({ contract, fetched, folders,account,userAlice }) => {
  const [folderclosed, setfolderclosed] = useState(true);
  const [docs, setdocs] = useState(null);
  const [val, setval] = useState(0);
  const [qrMade, setQrMade] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isQrModalOpen, setisQrModalOpen] = useState(false);
  const [isReqModalOpen, setisReqModalOpen] = useState(false);
  const [isActiveCompanyOpen, setisActiveCompanyOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [reqContent, setReqContent] = useState('');
  const [activeCompaniesContent, setactiveCompaniesContent] = useState('');
  const [activecompanyDetails, setactivecompanyDetails] = useState([]);
  const [companyDetails, setcompanyDetails] = useState([]);
  const [activeCompData, setactiveCompData] = useState([]);
  const [bg, setbg] = useState('');
  const openQrModal = () => {
    setisQrModalOpen(true);
    setQrMade(true)
  };
  const closeQrModal = () => {
    setisQrModalOpen(false);
  };
  const openReqModal = () => {
    setisReqModalOpen(true);
  };
  const closeReqModal = () => {
    setisReqModalOpen(false);
  };
  const openActiveCompanyModal = () => {
    setisActiveCompanyOpen(true);
  };
  const closeActiveCompanyModal = () => {
    setisActiveCompanyOpen(false);
  };
  const [reqs, setreqs] = useState(['1','2','3']);
  const companies = [
    {
      name: 'Company 1',
      address: '0x000000000000000000000000000000000000000000',
      firstAccess: '22/06/2021, 12:23',
    },
    {
      name: 'Company 2',
      address: '0x111111111111111111111111111111111111111111',
      firstAccess: '02/10/2020, 13:20',
    },
    {
      name: 'Company 3',
      address: '0x222222222222222222222222222222222222222222',
      firstAccess: '13/01/2017, 16:29',
    },
  ]
  const setBgColor = (index) => {
    if(index%3 === 0){
      return 'linear-gradient(to bottom, #87efa2, #0bb79a)'
    }
    else if(index%3 === 1){
      return 'linear-gradient(to bottom, #f4c402, #f56701)'
    }else{
      return 'linear-gradient(to bottom, #fa9f88, #fa4582ff)'
    }
  }
  const openFolder = async (i) => {
    setLoader(true);
    try {
      const res = await contract.returnDocs(i);
      console.log(res);
      setval(i);
      setdocs(res);
      setLoader(false);
      setfolderclosed(false);
    } catch (error) {
      console.log("Error");
    }
  };
  const callrequests=async()=>{
    try {
      const res = await contract.returnUserRequests();
      console.log("REquests",res);
      var companyDetails = [];
      for( var i =0;i<res.length;i++){
        const company = await contract.companyDetails(res[i].Address);
        companyDetails.push(company);
      }
      setcompanyDetails(companyDetails);
      console.log("Company",companyDetails);
      setreqs(res);
    } catch (error) {
      console.log("Error",error);
    }
  }
  const acceptRequest=async(id)=>{
    try {
      const res = await contract.acceptDetails(id);
      console.log("res");
      await userAlice.notification.subscribe(
        `eip155:5:0xaF7f488eDf63410AF7B82998A6a96a14dcB8e89d` // channel address in CAIP format
      )
    } catch (error) {
      console.log("error",error);
    }
    closeReqModal();
  }
  const rejectRequest=async(id)=>{
    try {
      const res = await contract.rejectDetails(id);
      console.log("res");
    } catch (error) {
      console.log("err",error);
    }
    closeReqModal();
  }
  const activeCompanies=async()=>{
    try {
      const res = await contract.accessedCompanies();
      console.log("res",res);
      var activecompanyDetails = [];
      for( var i =0;i<res.length;i++){
        const company = await contract.companyDetails(res[i].Address);
        activecompanyDetails.push(company);
      }
      setactivecompanyDetails(activecompanyDetails);
      setactiveCompData(res);
    } catch (error) {
      console.log("Error",error);
    }
  }
  const revokeAccess=async(address)=>{
    try {
      const res = await contract.revokeAccess(address);
      console.log("res",res);
    } catch (error) {
      console.log("error");
    }
  }
  useEffect(()=>{
    callrequests();
    activeCompanies();
  },[account])
  return (
    <>
  {!loader ? <div>
        {
          !isQrModalOpen && 
          <div className="qr">
          <button onClick={openQrModal}>
            Generate QR
            <MdQrCodeScanner 
              style={{
                display: 'inline', 
                transform: 'scale(1.6) translateY(-1px)', 
                marginLeft: '10px'
              }}/>
          </button>
        </div>
        }
        <Modal isOpen={isQrModalOpen} closeModal={closeQrModal} bg={'linear-gradient(to bottom, rgb(234, 234, 234), rgb(179, 179, 179))'}>
          <div>
            <div className="qr__code">
              <QRCode
                value={account}
                size={280}
                />
              <p className="qr__code__address" >
                <p>{account}</p>
                <CopyToClipboard 
                  text = {account} 
                  onCopy={()=>setCopied(true)}
                  >
                  {copied ? 
                  <LuCopyCheck style={{transform: 'scale(1.2) translateY(2px)'}}/>
                  // <img src={require('../../animation_lnu1fmgr_small.gif')}/>
                  :<LuCopy style={{cursor: 'pointer', transform: 'scale(1.2) translateY(2px)'}}/>}
                </CopyToClipboard>
              </p>
            </div>
          </div>
        </Modal>
        <Modal isOpen={isReqModalOpen} closeModal={closeReqModal} bg={bg}>
          {reqContent}
        </Modal>
        <Modal isOpen={isActiveCompanyOpen} closeModal={closeActiveCompanyModal} bg={bg}>
          {activeCompaniesContent}
        </Modal>
        {folderclosed ? (
          <div style={{transform: 'translateY(4rem)'}}>
            {fetched && (
              <div className="row">
                <div className="row__1">
                  <div className="row__header">
                    <div className="row__title">My folders</div>
                    <button className="row__btn">
                      View all <span>&rarr;</span>
                    </button>
                  </div>
                  <div className="row__sections">
                    {folders.map((folder, i) => {
                      return (
                        <div className='column'
                          style={{backgroundImage: `${setBgColor(i)}`, cursor: 'pointer', color: 'black'}}
                          onClick={() => {
                            openFolder(i);
                          }}
                        >
                          <Folder contract={contract} folder={folder} />

                        </div>
                      
                      );
                    })}
                  </div>
                </div>
                <div className="row__2">
                  <div className="row__header">
                    <div className="row__title">Requests</div>
                    <button className="row__btn">
                      View all <span>&rarr;</span>
                    </button>
                  </div>
                  <div className="row__sections">
                      {reqs.map((req, index)=>{ 
                        return(
                        <div key = {index} className="column" style={{backgroundImage: `${setBgColor(index)}`, cursor: 'pointer' , color: 'black'}}>
                          <div className="column__header">
                            <div className="image">
                              <img src={require('./360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg')} alt='companyimage' style={{
                                width: '40px',
                                borderRadius: '30px'
                              }}/>
                            </div>
                            <div className="column__title" style={{display: 'flex'}}>
                              <p style={{fontSize:'25px', fontWeight: '500'}}>
                                {companyDetails.length === 0 ? <>Company</> : <>{companyDetails[index].Name}</>}
                              </p>
                            </div>
                          </div>
                          <div className="column__content" style={{
                            padding: '3rem',
                            height: '70%'
                          }}>This company has requested your Details</div>
                          <div className="column__footer" 
                            style={{
                              marginTop: '1rem',
                              display: 'flex',
                              justifyContent: 'flex-end',
                              marginRight: '2rem'
                            }}
                          >
                            <p 
                              style={{
                                cursor: 'pointer', 
                                padding: '2px 9px',
                                fontSize: '15px',
                                fontWeight: 'lighter',
                                fontFamily: 'sans-serif'
                              }} 
                              onClick={()=>{
                                openReqModal()
                                setbg(setBgColor(index))
                                setReqContent(<div className="column__fields"  style={{border: 'none', color:'black'}}>
                                  <div className="popup">
                                    <div className="popup__up">
                                      <div className="image">
                                        <p style={{
                                          fontSize:'25px', 
                                          fontWeight: '500',
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}>{companyDetails.length === 0 ? <p>Company</p> : <p>{companyDetails[index].Name}</p>}
                                          </p>
                                      </div>
                                      <div className="details">

                                        {req.Name && <div>Name</div>}
                                        {req.Image&& <div>Image</div>}
                                        {req.DOB && <div>DOB</div>}
                                        {req.Phone && <div>Phone</div>}
                                      </div>
                                    </div>
                                    <div className="popup__down">
                                      {req.Folders[0] && <div>Medical</div>}
                                      {req.Folders[1] && <div>Bank</div>}
                                      {req.Folders[2] && <div>Academics</div>}
                                    </div>
                                  </div>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '3rem',
                                    gap: '2rem',
                                    padding: '0 1rem'
                                  }}>
                                    <button onClick={()=>{acceptRequest(index)}} className="submit__accept" style={{
                                      width: '50%'
                                    }}>Accept</button>
                                    <button onClick={()=>{rejectRequest(index)}} className="submit__decline" style={{
                                      width: '50%'
                                    }}>Decline</button>
                                  </div>
                              </div>)
                                console.log(reqContent)
                              }}
                            >
                              View Request</p>
                          </div>
                        </div>
                      )})}
                      
                  </div>
                </div>
                <div className="row__3">
                  <div className="row__header">
                    <div className="row__title">Active companies</div>
                    <button className="row__btn">
                      View all <span>&rarr;</span>
                    </button>
                  </div>
                  <div className="row__sections">
                      {activeCompData.map((active,key)=>{ return(
                        <div key = {key} className="column" style={{color: 'black', backgroundImage: `${setBgColor(key)}`}}>
                          <div className="column__header">
                            <div className="column__title">{activecompanyDetails.length === 0 ? <p>Company</p> : <p>{activecompanyDetails[key].Name}</p>} </div>
                          </div>
                          <div className="column__fields">
                          <ul>
                                  {active.Name && <li style={{backgroundColor: 'rgba(white, .3)'}}>Name</li>}
                                  {active.Image&& <li style={{backgroundColor: 'rgba(white, .3)'}}>Image</li>}
                                  {active.DOB && <li style={{backgroundColor: 'rgba(white, .3)'}}>DOB</li>}
                                  {active.Phone && <li style={{backgroundColor: 'rgba(white, .3)'}}>Phone</li>}
                                  <span>Folders:</span>
                                    <ul>
                                      {active.Folders[0] && <li style={{backgroundColor: 'rgba(white, .3)'}}>Medical</li>}
                                      {active.Folders[1] && <li style={{backgroundColor: 'rgba(white, .3)'}}>Bank</li>}
                                      {active.Folders[2] && <li style={{backgroundColor: 'rgba(white, .3)'}}>Academics</li>}
                                    </ul>
                                </ul>
                          </div>
                          <div className="column__footer">
                            <button onClick={()=>{revokeAccess(active.Address)}} id="revoke">Revoke access</button>
                          </div>
                        </div>
                      )})}
                  </div>
                </div>
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
          style={{transform: 'translateY(10rem)'}}
          />
          )}
      </div>
      : < div><Loader/></div>
      
    }
    </>
  );
};

export default UserPage;
