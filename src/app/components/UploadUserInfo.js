import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import axios from "axios";
import AnonymousPic from "../img/userPhotos/anonymous.jpg";
import WelcomePagePic from "../img/meeting.jpg";
import { introTextAtom } from "../app.js";
import { mtgTypesAtom } from "../app.js";
import { signingUpAtom } from "../app.js";
import "./styles/userPage.scss";

function UploadUserInfo(props) {
  const [selectedPhotoFile, setSelectedPhotoFile] = useState({});
  const [selfIntroUpdated, setSelfIntroUpdated] = useState(false);
  const [updatedIndicator, setUpdatedIndicator] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [introText, setIntroText] = useAtom(introTextAtom);
  const [mtgTypes, setMtgTypes] = useAtom(mtgTypesAtom);
	const [signingUp, setSigningUp] = useAtom(signingUpAtom);
	const [changedPhoto, setChangedPhoto] = useState(false);
	const [changedMtgTypes, setChangedMtgTypes] = useState(false);
	const [beginningSelfIntroText, setBeginningSelfIntroText] = useState("");
	const [userPhoto, setUserPhoto] = useState("../img/userPhotos/anonymous.jpg");

  const tick = () => {
    setEndTime(new Date());
  };

  const getSelfIntro = (user) => {
    return axios.get(`/api/selfIntro/${user}`);
  };

  const setSelfIntroTextAtStart = () => {
    getSelfIntro(props.user)
      .then((data) => {
				setBeginningSelfIntroText(data.data.text);
      })
      .catch((error) => console.log("Error in setSelfIntroTextAtStart: ", error));
  };
	
	useEffect(() => {
    setSelfIntroTextAtStart();
	  setUserPhoto(userImg);
	}, []);

	const OnChooseUserPhoto = (e) => {
    const enteredFile = e.target.files[0];
    switch (e.target.name) {
      case "selectedPhotoFile":
        setSelectedPhotoFile(enteredFile);
        break;
      default:
        setState({ [e.target.name]: e.target.value });
    }
    let formData = new FormData();
    formData.append("user", props.user);
    formData.append("selectedPhotoFile", enteredFile);
    axios
      .post("/api/uploadPhoto", formData)
      .then((result) => {
				setChangedPhoto(true);
      })
      .catch((errors) =>
        console.log("Errors in OnChooseUserPhoto: ", errors)
      );
  };

  const handleIntroTextChange = (event) => {
    setIntroText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataString = { user: props.user, selfIntro: introText };
    axios
      .post("/api/selfIntro", dataString)
      .then((result) => {setSelfIntroUpdated(true)})
      .catch((errors) => console.log("Errors in handleSubmit: ", errors));
  };
  
	const handleMtgTypesChange = (event) => {
    setMtgTypes(event.target.value);
  };

  const handleMtgTypesClick = (event) => {
    event.preventDefault();
    const dataString = { user: props.user, mtg_types: mtgTypes };

    axios
      .post("/api/uploadMtgTypes", dataString)
      .then((result) => {
				setChangedMtgTypes(true);
      })
      .catch((errors) =>
        console.log("Errors in handleMtgTypesClick: ", errors)
      );
  };

  const importAll = (r) => {
    return r.keys().map(r);
  };

  const getImages = () => {
    const rc = require.context("../img/userPhotos", false, /\.jpg$/);
    const importNames = (rc) =>
      rc.keys().map((file) => file.match(/[^\/]+$/)[0]);
    const binaries = importAll(rc);
    const filenames = importNames(rc);
    const images = [];
    for (let i = 0; i < filenames.length; i++) {
      images.push({
        name: filenames[i],
        binary: binaries[i],
      });
    }
    return images;
  };

  const Fragment = React.Fragment;
  const userImgName = props.user + ".jpg";
  const userImg = signingUp ? require("../img/userPhotos/anonymous.jpg") : require("../img/userPhotos/" + userImgName);
  
	return (
    <Fragment>
      <form onSubmit={handleSubmit} name="selfIntroForm" encType="multipart/form-data" >
        <h2 className='h2mt0'>Personal Photo and Self-Introduction</h2>
        <div className='vSpace5px' />
        <img src= {userImg} className='photoImg'/>
        <div className='browseInputLabel' >
          Choose personal Photo
          <input className='browseInput'
            type="file"
            name="selectedPhotoFile"
            label="Select Photo File" 
		        id="file-upload"
            onChange={OnChooseUserPhoto}
          />
        </div>

          <div className='vSpace5px' />
		      {changedPhoto ? (
						<div className='label5'>Your new photo will be visible the next time you visit the site.</div>
					) : null}
          <div className='vSpace5px' />
        &nbsp;&nbsp;
        <div className='inputColumn'>
          <textarea 
            name="selfIntro"
		        className="mtgTypesTextArea"
		        rows="8"
		        columns="30"
            form="selfIntroForm"
            defaultValue={beginningSelfIntroText}
            onChange={handleIntroTextChange}
          />
          <div className='vSpace5px' />
          <button className='buttonRounded200' type="submit">
            Enter Self-Intro
          </button>
          <div className='vSpace5px' />
		      {selfIntroUpdated ? (
           <div className='label5'>Self-intro text has been updated.</div>
					) : null}
        </div>
      </form>

      <div className='vSpace10px'/>
      <div className='vSpace10px'/>

      <form onSubmit={handleMtgTypesClick} name="mtgTypesForm">
        <div className='inputColumn'>
            <h3>
              Typical meetings:
            </h3>
            <textarea 
		          className='mtgTypesTextArea'
              name="mtgTypesArea"
	            rows="1"
	            columns="30"
              form="mtgTypesForm"
              defaultValue={props.mtg_types}
              onChange={handleMtgTypesChange}
            />

          <div className='vSpace5px' />
            <button className='buttonRounded200' type="submit" >
              Enter Meeting Types 
            </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		        {changedMtgTypes ? (
				  		<h3>Meeting types updated.</h3>
				  	) : null}
        </div>
        <div className='vSpace5px' />
        <div className='vSpace5px' />
        <div className='vSpace5px' />
      </form>
    </Fragment>
  );
}

export default UploadUserInfo;
