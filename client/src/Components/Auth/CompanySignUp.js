import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./CompanySignUp.scss";
import { convToBase64 } from "../Helpers/convToBase64.js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const CompanySignUp = ({ contract, accounts, provider }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [regId, setRegId] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [buttonText, setButtonText] = useState("Upload your company's image");

  const onChangeProfilePict = async (e) => {
    if (e?.target?.files[0]) {
      setImage();
      const dataPict = await convToBase64(e.target.files[0]);
      setImage(dataPict);
      setButtonText("Remove image");
    } else {
      setImage("");
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Vals", contactNum, regId, name, image);
      const res = await contract.createCompany(contactNum, regId, name, image);
      console.log(res);
      const _signer = new ethers.Wallet(
        "4db9c06dab911fec3585fa2b0e519931a96a16e377a750c63fd6aa31d2cc3e61",
        provider
      );
      console.log("CHanged", _signer);
    } catch (error) {
      console.log("Error", error);
    }
    //axios request to post
  };
  return (
    <div className="company-registration">
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form__input">
          <label for="name" className="form__input--label">
            Enter your Company's name
          </label>
          <input
            required
            className="form__input--name"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            autoComplete={"off"}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form__input">
          <label for="regId" className="form__input--label">
            Enter your company's Registration ID
          </label>
          {/* <input required  id='regId' type='text'  /> */}

          <input
            required
            className="form__input--reg"
            id="name"
            type="text"
            placeholder="Registration Id"
            value={regId}
            autoComplete={"off"}
            onChange={(e) => setRegId(e.target.value)}
          />
        </div>
        <div className="form__input">
          <label for="number" className="form__input--label">
            Enter your phone number
          </label>
          <PhoneInput
            inputStyle={{ backgroundColor: "#0a2c3f" }}
            dropdownStyle={{ backgroundColor: "#0a2c3f" }}
            buttonStyle={{ backgroundColor: "#0a2c3f" }}
            country={"in"}
            className="form__input--contactnum"
            id="number"
            type="number"
            autoComplete={"off"}
            placeholder="Phone number"
            value={contactNum}
            onChange={(phone) => setContactNum(phone)}
          />
        </div>
        <div className="form__input form__input--upload-image">
          {image ? (
            <>
              <img
                src={image}
                alt="Profile pic"
                className="form__input--profile-pict"
              />
            </>
          ) : (
            <></>
          )}
          {buttonText === "Upload your company's image" ? (
            <>
              <label for="image" className="form__input--label-upload ">
                {buttonText}
              </label>
            </>
          ) : (
            <>
              <button
                for="image"
                className="form__input--label-remove"
                onClick={(e) => {
                  e.preventDefault();
                  onChangeProfilePict();
                  setButtonText("Upload your company's image");
                }}
              >
                {buttonText}
              </button>
            </>
          )}
          <input
            className="form__input--image"
            id="image"
            type="file"
            accept="image/*"
            autoComplete={"off"}
            onChange={(e) => onChangeProfilePict(e)}
            hidden={true}
          />
        </div>
        <div className="form__submit">
          <button className="form__submit--btn">Submit</button>
        </div>
      </form>
      {/* <form className='form' onSubmit={e=>onSubmit(e)}>
          
          <div className='form__input'>
            <label for='date' className='form__input--label'>Enter your DOB</label>
            <input 
              required 
              className='form__input--date' 
              id='date' 
              type='date' 
              defaultValue={''}
              placeholder='DOB' 
              autoComplete={'off'}

              value={date}
              onChange={(e)=>setDate(e.target.value)}
            />
          </div>
          <div className='form__input'>
            <label for='number' className='form__input--label'>Enter your phone number</label>
            <PhoneInput 
              inputStyle={{ backgroundColor: '#0a2c3f' }}
              dropdownStyle={{ backgroundColor: '#0a2c3f' }}
              buttonStyle={{ backgroundColor: '#0a2c3f' }}
              country={'in'}
              className='form__input--contactnum' 
              id='number' 
              type='number' 
              autoComplete={'off'}

              placeholder='Phone number'
              value={contactNum}
              onChange={(phone)=>setContactNum(phone)}
            />
          </div>
          <div className='form__input form__input--upload-image'>
            {image ? <>
              <img src={image} alt='Profile pic' className='form__input--profile-pict'/>
            </>:<>
            </>}
            {buttonText === 'Upload your profile image' ? <>
              <label for='image' className='form__input--label-upload '>{buttonText}</label>
            </> : <>
              <button for='image' className='form__input--label-remove' onClick={(e)=>{
                e.preventDefault()
                onChangeProfilePict()
                setButtonText('Upload your profile image')
                }}>{buttonText}</button>
            </>}
            <input 
              required 
              className='form__input--image' 
              id='image' 
              type='file' 
              accept='image/*' 
              autoComplete={'off'}
              onChange={(e)=>onChangeProfilePict(e)}
              hidden={true}
            />
          </div>

          <div className='form__submit'>
            <button className='form__submit--btn'>Submit</button>
          </div>
        </form> */}
    </div>
  );
};

export default CompanySignUp;
