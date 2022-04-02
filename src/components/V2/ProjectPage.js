import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisFile } from "react-moralis";
import construction from "../../img/construction.png";
import ReactHtmlParser from "react-html-parser";
import { Helmet } from "react-helmet";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

import "../ProjectCard.css";
import "../Project.css";
import "../ProjectPage.css";
import ProfileCard from "../ProfileCard";
import Rating from "../Rating";
import Bookmark from "../Bookmark";
import RatingProject from "../RatingProject";
import Reviews from "../Reviews";
import SocialIconBar from "../SocialIconBar";
import SendMessagePopUp from "../SendMessagePopUp";
import Alert from "../Alert";
import EditProject from "../EditProject";
import HelmetMetaData from "../HelmetMetaData";
import websiteIcon from "../../img/projectpage/websiteicon.svg";

function ProjectPage(props) {
  const { user, Moralis, isInitialized } = useMoralis();
  const { isUploading, saveFile } = useMoralisFile();
  const [owner, setOwnerProject] = useState(false);
  const [sendMessagePopUpVisible, setSendMessagePopUpVisible] = useState(false);
  const [editProjectMenu, setOpenEditProjectMenu] = useState(false);
  const [openChangePhoto, setOpenChangePhoto] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContents, setAlertContents] = useState();
  const [activePhoto, setActivePhoto] = useState(props.photo1);
  const [photoFile, setPhotoFile] = useState();
  const [photoFileName, setPhotoFileName] = useState();
  const [previewPic, setPreviewPic] = useState(construction);
  const [photoNumber, setPhotoNum] = useState();
  const mainPhoto = props.photo1;

  const verified = props.isVerified;
  const isLive = props.isLive;

  const onChangePhoto = (e) => {
    setPhotoFile(e.target.files[0]);
    setPhotoFileName(e.target.files[0].name);
    setPreviewPic(URL.createObjectURL(e.target.files[0]));
  };

  const onSubmitPhoto = async (e) => {
    try {
      const params = { projectTitle: props.title };
      const project = await Moralis.Cloud.run("getProjectByName", params);
      const file = photoFile;
      const name = photoFileName;
      let fileIpfs = await saveFile(name, file, { saveIPFS: true });
      let currentPhoto;
      if (photoNumber == 0) {
        currentPhoto = "projectPhoto";
      } else if (photoNumber == 1) {
        currentPhoto = "projectPhoto1";
      } else if (photoNumber == 2) {
        currentPhoto = "projectPhoto2";
      }
      project.set(currentPhoto, fileIpfs);
      await project.save();
      setAlertContents("Photo Updated!");
      setAlertVisible(true);
    } catch (error) {
      alert(error);
    }
  };

  const checkOwnership = async () => {
    if (user) {
      const username = user.attributes?.username;
      if (username == props.creator) {
        setOwnerProject(true);
      }
    }
  };

  const verificationEmail = async () => {
    const params = { projectName: props.title };
    console.log(params);
    try {
      await Moralis.Cloud.run("sendVerifyEmail", params);
      console.log("emailSent");
    } catch (error) {
      alert(error);
    }
  };

  const sendReport = async () => {
    const params = { projectName: props.title };
    console.log(params);
    try {
      await Moralis.Cloud.run("sendReportEmail", params);
      console.log("emailSent");
    } catch (error) {
      alert(error);
    }
  };

  const userCheck = async () => {
    console.log(user);
    const eViral = await Moralis.Web3.getERC20({
      tokenAddress: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
    });

    // const beViral = await Moralis.Web3.getERC20({chain:'bsc', tokenAddress: '0x7CeC018CEEF82339ee583Fd95446334f2685d24f'});
    const balanceETH = eViral.balance;
    // const balanceBSC = beViral.balance;
    if (balanceETH == 0) {
      setAlertContents(
        <>
          <div className="alert-popup-contents">
            You'll need to own either eViral or beViral to access this feature.
            <Link to="/">
              <button className="btn2">Buy from Home Page</button>
            </Link>
          </div>
        </>
      );
      setAlertVisible(true);
    } else if (!user.attributes?.profileCreated) {
      setAlertContents(
        <>
          <div className="alert-popup-contents">
            You'll need to set up a Profile to access this feature.
          </div>
        </>
      );
      setAlertVisible(true);
    } else {
      setSendMessagePopUpVisible(true);
    }
  };

  const openChangePhotoMenu = (photoNum) => {
    setPhotoNum(photoNum);
    setOpenChangePhoto(true);
  };

  const setActivePhotos = (file, photoNum) => {
    setPhotoNum(photoNum);
    setActivePhoto(file);
  };

  useEffect(() => {
    if (isInitialized) {
      checkOwnership();
    }
  }, [isInitialized]);

  return (
    <>
      <Helmet>
        <meta
          property="og:url"
          content={`https://viralcrypto.app/profiles/${props.title}`}
        />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.summary} />
        <meta property="og:image" content={props.photo1} />
        <meta property="og:site_name" content="Viracl Crypto" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={props.twitter} />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.summary} />
        <meta name="twitter:image" content={props.photo1} />
      </Helmet>
      <div className="project-page">
        <div id="projectPage-description">
          <div id="projectPage-description-tagsandrating">
            <div id="projectPage-description-tag">
              {verified && (
                <div>
                  <i class="fas fa-clipboard-check">Pro</i>
                </div>
              )}
              {isLive && <i class="fas fa-chart-line">Live</i>}
              {!isLive && <i class="fas fa-wrench">InDev</i>}
            </div>
            <div id="projectPage-description-rating">
              <Rating title={props.title} />
            </div>
          </div>
          <h1>{props.title}</h1>
          <p>{props.summary}</p>
          <Bookmark projectTitle={props.projectTitle}>
            <span>Add to favorties</span>
          </Bookmark>
          <img id="websiteIcon" src={websiteIcon} />
          <Link
            className="website-link"
            to={{ pathname: `https://${props.website}` }}
            target="_blank"
          >
            {props.website}
          </Link>
        </div>
        <div className="project-page-container">
          <div className="project-page-body">
            <div className="project-page-project-container">
              <div className="project-page-title">
                {verified && (
                  <div>
                    <i class="fas fa-clipboard-check">Pro</i>
                  </div>
                )}
                {isLive && <i class="fas fa-chart-line">Live</i>}
                {!isLive && <i class="fas fa-wrench">InDev</i>}
                <h2>{props.title}</h2>
                <Rating title={props.title} />
                <Bookmark projectTitle={props.projectTitle} />
              </div>
              <h2>{props.summary}</h2>
              <div
                className={
                  owner ? "project-page-photo-owner" : "project-page-photo"
                }
                onClick={owner ? () => openChangePhotoMenu(photoNumber) : ""}
              >
                <img className="project-page-photo-img" src={activePhoto} />
                <div className="middle-of-projectPic">
                  <i class="fas fa-camera-retro"></i>
                </div>
              </div>
              <div className="project-page-photo-thumbnails">
                <div className="project-page-photo-thumbnail">
                  <img
                    className="project-page-photo-img"
                    src={props.photo1}
                    onClick={(e) => setActivePhotos(e.currentTarget.src, 0)}
                  />
                </div>
                {(props.photo2 || owner) && (
                  <div className="project-page-photo-thumbnail">
                    {!props.photo2 && (
                      <div
                        id="add-photo-icon"
                        onClick={() => openChangePhotoMenu(1)}
                      >
                        <i class="fas fa-plus"></i>
                      </div>
                    )}
                    {props.photo2 && (
                      <img
                        className="project-page-photo-img"
                        src={props.photo2}
                        onClick={(e) => setActivePhotos(e.currentTarget.src, 1)}
                      />
                    )}
                  </div>
                )}
                {(props.photo3 || owner) && (
                  <div className="project-page-photo-thumbnail">
                    {!props.photo3 && (
                      <div
                        id="add-photo-icon"
                        onClick={() => openChangePhotoMenu(2)}
                      >
                        <i class="fas fa-plus"></i>
                      </div>
                    )}
                    {props.photo3 && (
                      <img
                        className="project-page-photo-img"
                        src={props.photo3}
                        onClick={(e) => setActivePhotos(e.currentTarget.src, 2)}
                      />
                    )}
                  </div>
                )}
              </div>
              {owner && (
                <p id="change-photo-project-text">
                  Click/Tap a thumbnail to change it
                </p>
              )}
              <div className="project-page-description">
                <div className="socialShareLinks">
                  <h5 id="socialShareLink">SHARE</h5>
                  <EmailShareButton
                    url={`https://viralcrypto.app/projects/${props.title}`}
                    id="socialShareLink"
                  >
                    <EmailIcon size={36} round={false} />
                  </EmailShareButton>
                  <FacebookShareButton
                    quote={props.summary}
                    url={`https://viralcrypto.app/projects/${props.title}`}
                    id="socialShareLink"
                  >
                    <FacebookIcon size={36} round={false} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={`https://viralcrypto.app/projects/${props.title}`}
                    id="socialShareLink"
                  >
                    <TwitterIcon size={36} round={false} />
                  </TwitterShareButton>
                  <PinterestShareButton
                    description={`${props.title} "-" ${props.summary}`}
                    media={props.photo1}
                    url={`https://viralcrypto.app/projects/${props.title}`}
                    id="socialShareLink"
                  >
                    <PinterestIcon size={36} round={false} />
                  </PinterestShareButton>
                  <TelegramShareButton
                    url={`https://viralcrypto.app/projects/${props.title}`}
                    id="socialShareLink"
                  >
                    <TelegramIcon size={36} round={false} />
                  </TelegramShareButton>
                </div>

                <h3>About</h3>

                <div className="project-page-links">
                  <Link
                    className="website-link"
                    to={{ pathname: `https://${props.website}` }}
                    target="_blank"
                    aria-label="Website"
                  >
                    <i class="fas fa-link"></i>
                    {props.website}
                  </Link>
                  <SocialIconBar
                    twitter={props.twitter}
                    telegram={props.telegram}
                    discord={props.discord}
                    linkedIn={props.linkedIn}
                    youtube={props.youtube}
                    twitch={props.twitch}
                  />
                </div>

                <h5>
                  <img className="profileThumb" src={props.creatorProfilePic} />{" "}
                  {props.creator} {props.createdOn}
                </h5>
                <p>{ReactHtmlParser(props.description)}</p>
              </div>
              <div className="ratingReviews">
                <Reviews title={props.title} />
                {!owner && (
                  <button
                    className="report-button btn1"
                    onClick={() => sendReport()}
                  >
                    Report
                  </button>
                )}
              </div>
            </div>
            <div className="project-page-creator-container">
              <div className="project-page-creator-wrapper">
                <div className="project-page-creator-profile-wrapper">
                  <h4>Project Creator</h4>
                  {!owner && (
                    <button
                      className="send-msg-button btn2"
                      onClick={() => userCheck()}
                    >
                      {" "}
                      Send Message
                    </button>
                  )}
                  <ProfileCard
                    username={props.creator}
                    src={props.creatorProfilePic}
                    bio={props.bio}
                  />
                  {owner && (
                    <div className="edit-project-btn-wrapper">
                      <button
                        className="edit-project-btn btn1"
                        onClick={() => setOpenEditProjectMenu(true)}
                      >
                        <i class="fas fa-puzzle-piece"></i>
                        <span>Edit&nbsp;Project</span>
                      </button>
                    </div>
                  )}

                  {owner && !verified && (
                    <button
                      className="verify-request-button btn2"
                      onClick={() => verificationEmail()}
                    >
                      {" "}
                      Get Verified
                    </button>
                  )}
                </div>

                {!owner && <RatingProject projectName={props.title} />}
              </div>
            </div>
          </div>
          <div className="project-page-footer-container">
            <div className="project-page-footer"></div>
          </div>
        </div>
        {openChangePhoto && (
          <div className="update-profile-background">
            <div className="update-container">
              <div className="update-profilepic-container-wrapper">
                <div className="update-profile-header">
                  <h3 className="update-profile-title">Choose a Picture</h3>
                  <span
                    className="exitMenu"
                    onClick={() => {
                      setOpenChangePhoto(false);
                    }}
                  >
                    <i class="far fa-times-circle"></i>
                  </span>
                </div>
                <div className="project-page-photo">
                  <img
                    className="project-page-photo-img"
                    src={previewPic}
                    alt=""
                  />
                </div>
                <form className="form-input-container">
                  <form onSubmit={onSubmitPhoto}>
                    <div className="mb-3">
                      <label htmlFor="profilePhoto" className="form-label">
                        Select Image File
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        multiple="false"
                        id="profilePhoto"
                        onChange={onChangePhoto}
                      />
                    </div>
                    <div className="change-profile-pic-footer">
                      <input
                        type="button"
                        value="Upload"
                        className="upload-profilePic-button btn2"
                        onClick={() => onSubmitPhoto()}
                      />
                      <button
                        className="btn1"
                        onClick={() => {
                          setOpenChangePhoto(false);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      {!owner && sendMessagePopUpVisible && (
        <SendMessagePopUp
          visible={setSendMessagePopUpVisible}
          creatorProfilePic={props.creatorProfilePic}
          creatorName={props.creator}
          projectPic={props.src}
          projectName={props.title}
        />
      )}
      {alertVisible && (
        <Alert visible={setAlertVisible} content={alertContents} />
      )}
      {editProjectMenu && (
        <EditProject
          closeCreateProjectMenu={setOpenEditProjectMenu}
          title={props.title}
          summary={props.summary}
          description={props.description}
          website={props.website}
          projectPhoto={props.photo1}
          twitter={props.twitter}
          telegram={props.telegram}
          discord={props.discord}
          linkedIn={props.linkedIn}
          youtube={props.youtube}
          twitch={props.twitch}
          isOwner={owner}
        />
      )}
    </>
  );
}

export default ProjectPage;
