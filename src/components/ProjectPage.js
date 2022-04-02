import React, { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useMoralis, useMoralisFile } from "react-moralis";
import construction from "../img/construction.png";
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

import "./ProjectCard.css";
import "./Project.css";
import "./ProjectPage.css";
import ProfileCard from "./ProfileCard";
import Rating from "./Rating";
import Bookmark from "./Bookmark";
import RatingProject from "./RatingProject";
import Reviews from "./Reviews";
import SocialIconBar from "./SocialIconBar";
import SendMessagePopUp from "./SendMessagePopUp";
import Alert from "./Alert";
import EditProject from "./EditProject";
import HelmetMetaData from "./HelmetMetaData";
import ReviewCard from "./ReviewCard";

import websiteIcon from "../img/projectpage/websiteicon.svg";
import "../components/V2/ProjectPage.css";
import shareTelegram from "../img/shareIcons/telegram.svg";
import shareTwitter from "../img/shareIcons/twitter.svg";
import shareLinkedIn from "../img/shareIcons/linkedin.svg";
import shareEmail from "../img/shareIcons/email.svg";
import shareFacebook from "../img/shareIcons/facebook.svg";
import sharePinterest from "../img/shareIcons/pinterest.svg";
import tagLive from "../img/tagLive.svg";
import tagIndev from "../img/tagINDEV.svg";
import tagPro from "../img/tagPro.svg";
import addImage from "../img/addImage.svg";
import Exit from "../img/exit.svg";
import shareYoutube from "../img/shareIcons/youtube.svg";
import shareTwitch from "../img/shareIcons/twitch.svg";
import shareMedium from "../img/shareIcons/medium.svg";

import AVAX from "../img/BlockChains/avalanche.png";
import ADA from "../img/BlockChains/cardano.png";
import ATOM from "../img/BlockChains/cosmos.png";
import FTM from "../img/BlockChains/fantom.png";
import ONE from "../img/BlockChains/harmony.png";
import HECO from "../img/BlockChains/heco.png";
import DOT from "../img/BlockChains/polkadot.png";
import MATIC from "../img/BlockChains/polygon.png";
import PULS from "../img/BlockChains/pulsechain.png";
import SOL from "../img/BlockChains/solana.png";
import TRON from "../img/BlockChains/tron.png";
import ETH from "../img/BlockChains/eth.png";
import BSC from "../img/BlockChains/bsc.png";

function ProjectDisplay(props) {
  const { url } = useRouteMatch();
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
  const [chains, setChains] = useState(props.blockchains);
  const [features, setFeatures] = useState(props.featureTags);

  const [twitterActive, setTwitterActive] = useState(true);
  const [youtubeActive, setYoutubeActive] = useState(true);
  const [telegramActive, setTelegramActive] = useState(true);
  const [discordActive, setDiscordActive] = useState(true);
  const [linkedInActive, setLinkedInActive] = useState(true);
  const [twitchActive, setTwitchActive] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [seeReviews, setSeeReviews] = useState(false);
  const [mobile, setMobile] = useState(false);

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
    } catch (error) {
      alert(error);
    }
    setAlertContents("Sent verification request.");
    setAlertVisible(true);
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
    setAlertContents("Report sent.");
    setAlertVisible(true);
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

  const loadReviews = async () => {
    const params = { projectTitle: props.title };
    const reviewList = await Moralis.Cloud.run("loadReviews", params);
    setReviews(reviewList);
    setSeeReviews(!seeReviews);
  };
  const loadTeam = async () => {
    const params = { projectTitle: props.title };
    const team = await Moralis.Cloud.run("loadTeamMembers", params);
    setTeamMembers(team);
  };

  useEffect(() => {
    if (isInitialized) {
      checkOwnership();
      loadReviews();
      loadTeam();
    }
  }, [isInitialized]);

  const resize = () => {
    if (window.innerWidth <= 960) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      resize();
    }
  }, [isInitialized]);

  window.addEventListener("resize", resize);

  return (
    <>
      {/* <HelmetMetaData
        description = {props.summary}
        title={props.title}
        image={props.photo1} 
        path={`/projects/${props.title}`}     
      ></HelmetMetaData> */}
      <Helmet>
        <meta
          property="og:url"
          content={`https://viralcrypto.app/profiles/${props.title}`}
        />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.summary} />
        <meta property="og:image" content={mainPhoto} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={props.twitter} />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.summary} />
        <meta name="twitter:image" content={mainPhoto} />
      </Helmet>
      <div id="projectPage">
        {!mobile && (
          <>
            <div id="projectPage-information">
              <div id="projectPage-description-tagsandrating">
                <div id="projectPage-description-tags">
                  {verified && <img id="projectTag" src={tagPro} />}
                  {isLive && <img id="projectTag" src={tagLive} />}
                  {!isLive && <img id="projectTag" src={tagIndev} />}
                </div>
                <div id="projectPage-description-rating">
                  <Rating title={props.title} />
                </div>
              </div>
              <h1 id="projectPage-title">{props.title}</h1>
              <p id="projectPage-summary">{props.summary}</p>
              <div id="profilecard-skillTags">
                {props.featureTags && (
                  <>
                    {props.featureTags && (
                      <>
                        {props.featureTags.map((element) => (
                          <div id="profile-skillTags">{element}</div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              {props.blockchains && (
                <>
                  {props.blockchains && (
                    <div id="projectPage-blockChains">
                      {props.blockchains.map((element) => {
                        return (
                          <img
                            src={
                              element == "ETH"
                                ? ETH
                                : element == "BSC"
                                ? BSC
                                : element == "MATIC"
                                ? MATIC
                                : element == "AVAX"
                                ? AVAX
                                : element == "FTM"
                                ? FTM
                                : element == "ATOM"
                                ? ATOM
                                : element == "ONE"
                                ? ONE
                                : element == "PULS"
                                ? PULS
                                : element == "DOT"
                                ? DOT
                                : element == "ADA"
                                ? ADA
                                : element == "TRON"
                                ? TRON
                                : element == "HECO"
                                ? HECO
                                : element == "SOL"
                                ? SOL
                                : ""
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              <div id="socialShares">
                <p>Socials:</p>
                {props.twitter && (
                  <Link
                    className="profile-social-icon twitter"
                    to={{ pathname: `https://twitter.com/${props.twitter}` }}
                    target="_blank"
                    aria-label="Twitter"
                  >
                    <img id="socialShareIcon" src={shareTwitter} />
                  </Link>
                )}
                {props.telegram && (
                  <Link
                    className="profile-social-icon telegram"
                    to={{ pathname: `https://t.me/${props.telegram}` }}
                    target="_blank"
                    aria-label="Telegram"
                  >
                    <img id="socialShareIcon" src={shareTelegram} />
                  </Link>
                )}
                {props.linkedIn && (
                  <Link
                    className="profile-social-icon linkedIn"
                    to={{
                      pathname: `https://linkedin.com/in/${props.linkedIn}`,
                    }}
                    target="_blank"
                    aria-label="LinkedIn"
                  >
                    <img id="socialShareIcon" src={shareLinkedIn} />
                  </Link>
                )}
                {props.youtube && (
                  <Link
                    className="profile-social-icon youtube"
                    to={{ pathname: `https://youtube.com/c/${props.youtube}` }}
                    target="_blank"
                    aria-label="Youtube"
                  >
                    <img id="socialShareIcon" src={shareYoutube} />
                  </Link>
                )}
                {props.twitch && (
                  <Link
                    className="profile-social-icon twitch"
                    to={{ pathname: `https://twitch.tv/${props.twitch}` }}
                    target="_blank"
                    aria-label="Twitch"
                  >
                    <img id="socialShareIcon" src={shareTwitch} />
                  </Link>
                )}
                {props.medium && (
                  <Link
                    className="profile-social-icon twitch"
                    to={{ pathname: `https://${props.medium}` }}
                    target="_blank"
                    aria-label="Twitch"
                  >
                    <img id="socialShareIcon" src={shareMedium} />
                  </Link>
                )}
              </div>
              <div id="saveProject">
                <Bookmark projectTitle={props.projectTitle} />
                <p>Add to favorites</p>
              </div>
              <div id="projectWebsite">
                <img id="websiteIcon" src={websiteIcon} />
                <Link
                  className="website-link"
                  to={{ pathname: `https://${props.website}` }}
                  target="_blank"
                >
                  {props.website}
                </Link>
              </div>
              <div id="socialShares">
                <p>Share:</p>
                <EmailShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareEmail} />
                </EmailShareButton>
                <FacebookShareButton
                  quote={props.summary}
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareFacebook} />
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareTwitter} />
                </TwitterShareButton>
                <PinterestShareButton
                  description={`${props.title} "-" ${props.summary}`}
                  media={props.photo1}
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={sharePinterest} />
                </PinterestShareButton>
                <TelegramShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareTelegram} />
                </TelegramShareButton>
                <LinkedinShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareLinkedIn} />
                </LinkedinShareButton>
              </div>
              <p id="projectPage-description">
                {ReactHtmlParser(props.description)}
              </p>
            </div>
            <div id="projectPage-photo-creator-review">
              <div id="projectPage-photo-container">
                {/* <img  className="project-page-photo-img" src={activePhoto} /> */}
                <img id="projectPage-photo" src={activePhoto} />
              </div>
              <div id="projectPage-thumbnails">
                {props.photo1 && (
                  <img
                    id="projectPage-thumbnail"
                    src={props.photo1}
                    onClick={(e) => setActivePhotos(e.currentTarget.src, 0)}
                  />
                )}
                {props.photo2 && (
                  <img
                    id="projectPage-thumbnail"
                    src={props.photo2}
                    onClick={(e) => setActivePhotos(e.currentTarget.src, 1)}
                  />
                )}
                {props.photo3 && (
                  <img
                    id="projectPage-thumbnail"
                    src={props.photo3}
                    onClick={(e) => setActivePhotos(e.currentTarget.src, 2)}
                  />
                )}
              </div>
              {owner && (
                <div id="myProject-buttons">
                  {owner && (
                    <button
                      id="myProject-button"
                      onClick={() => setOpenEditProjectMenu(true)}
                    >
                      <span>Edit&nbsp;Project</span>
                    </button>
                  )}
                  {owner && !verified && (
                    <button
                      id="myProject-button"
                      onClick={() => verificationEmail()}
                    >
                      {" "}
                      Get Verified
                    </button>
                  )}
                </div>
              )}
              <div id="projectPage-creator">
                <Link to={`/profiles/${props.creator}`}>
                  <img
                    id="projectPage-creator-profilePic"
                    src={props.creatorProfilePic}
                  />
                </Link>
                <div id="projectPage-creator-info">
                  <h4>{props.creator}</h4>
                  <p id="creator-createdOn">{props.createdOn}</p>
                  <p id="creator-bio">{props.bio}</p>
                </div>
                {!owner && (
                  <div id="creator-message-buttons">
                    <button id="sendMessage-button" onClick={() => userCheck()}>
                      Send Message
                    </button>
                    <button
                      id="sendMessage-button"
                      onClick={() => sendReport()}
                    >
                      Report
                    </button>
                  </div>
                )}
              </div>
              {teamMembers.length >= 1 && (
                <div id="projectPage-team">
                  <div id="teamPanel">
                    {teamMembers.map((member) => (
                      <div key={member.username} id="teamMember">
                        <Link to={`/profiles/${props.creator}`}>
                          <img
                            id="projectPage-team-profilePic"
                            src={member.profilePic}
                          />
                        </Link>
                        <p>{member.username}</p>
                      </div>
                    ))}
                  </div>
                  {owner && (
                    <button id="myProject-button"> Edit Team Members</button>
                  )}
                </div>
              )}
              {teamMembers.length == 0 && owner && (
                <div id="projectPage-team">
                  <button id="myProject-button"> Add Team Members</button>
                </div>
              )}
              {!owner && <RatingProject projectName={props.title} />}
              <button id="showReviews-button" onClick={() => loadReviews()}>
                Show&nbsp;Reviews
              </button>
              {seeReviews && (
                <div className="project-page-review-container">
                  <h2>Reviews</h2>
                  <div className="project-page-reviews">
                    {reviews.map((review) => (
                      <div key={review.title}>
                        <ReviewCard
                          username={review.username}
                          stars={review.stars}
                          review={review.review}
                          reviewerPic={review.reviewerPic}
                          createdAt={review.createdAt}
                          reviewTitle={review.reviewTitle}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {mobile && (
          <>
            <div id="projectPage-information">
              <div id="projectPage-photo-container">
                <img id="projectPage-photo" src={activePhoto} />
              </div>
              <div id="projectPage-thumbnails">
                <div id="projectPage-thumbnails">
                  {props.photo1 && (
                    <img
                      id="projectPage-thumbnail"
                      src={props.photo1}
                      onClick={(e) => setActivePhotos(e.currentTarget.src, 0)}
                    />
                  )}
                  {props.photo2 && (
                    <img
                      id="projectPage-thumbnail"
                      src={props.photo2}
                      onClick={(e) => setActivePhotos(e.currentTarget.src, 1)}
                    />
                  )}
                  {props.photo3 && (
                    <img
                      id="projectPage-thumbnail"
                      src={props.photo3}
                      onClick={(e) => setActivePhotos(e.currentTarget.src, 2)}
                    />
                  )}
                </div>
              </div>
              {owner && (
                <div id="myProject-buttons">
                  {owner && (
                    <button
                      id="myProject-button"
                      onClick={() => setOpenEditProjectMenu(true)}
                    >
                      <span>Edit&nbsp;Project</span>
                    </button>
                  )}
                  {owner && !verified && (
                    <button
                      id="myProject-button"
                      onClick={() => verificationEmail()}
                    >
                      {" "}
                      Get Verified
                    </button>
                  )}
                </div>
              )}
              <div id="projectPage-description-tagsandrating">
                <div id="projectPage-description-tags">
                  {verified && <img id="projectTag" src={tagPro} />}
                  {isLive && <img id="projectTag" src={tagLive} />}
                  {!isLive && <img id="projectTag" src={tagIndev} />}
                </div>
                <div id="projectPage-description-rating">
                  <Rating title={props.title} />
                </div>
              </div>
              <h1 id="projectPage-title">{props.title}</h1>
              <p id="projectPage-summary">{props.summary}</p>
              <div id="profilecard-skillTags">
                {props.featureTags && (
                  <>
                    {props.featureTags && (
                      <>
                        {props.featureTags.map((element) => (
                          <div id="profile-skillTags">{element}</div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              {props.blockchains && (
                <>
                  {props.blockchains && (
                    <div id="projectPage-blockChains">
                      {props.blockchains.map((element) => {
                        return (
                          <img
                            src={
                              element == "ETH"
                                ? ETH
                                : element == "BSC"
                                ? BSC
                                : element == "MATIC"
                                ? MATIC
                                : element == "AVAX"
                                ? AVAX
                                : element == "FTM"
                                ? FTM
                                : element == "ATOM"
                                ? ATOM
                                : element == "ONE"
                                ? ONE
                                : element == "PULS"
                                ? PULS
                                : element == "DOT"
                                ? DOT
                                : element == "ADA"
                                ? ADA
                                : element == "TRON"
                                ? TRON
                                : element == "HECO"
                                ? HECO
                                : element == "SOL"
                                ? SOL
                                : ""
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              <div id="saveProject">
                <Bookmark projectTitle={props.projectTitle} />
                <p>Add to favorites</p>
              </div>
              <div id="projectWebsite">
                <img id="websiteIcon" src={websiteIcon} />
                <Link
                  className="website-link"
                  to={{ pathname: `https://${props.website}` }}
                  target="_blank"
                >
                  {props.website}
                </Link>
              </div>
              <div id="socialShares">
                <p>Share:</p>
                <EmailShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareEmail} />
                </EmailShareButton>
                <FacebookShareButton
                  quote={props.summary}
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareFacebook} />
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareTwitter} />
                </TwitterShareButton>
                <PinterestShareButton
                  description={`${props.title} "-" ${props.summary}`}
                  media={props.photo1}
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={sharePinterest} />
                </PinterestShareButton>
                <TelegramShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareTelegram} />
                </TelegramShareButton>
                <LinkedinShareButton
                  url={`https://viralcrypto.app/projects/${props.title}`}
                  id="socialShareLink"
                >
                  <img id="socialShareIcon" src={shareLinkedIn} />
                </LinkedinShareButton>
              </div>
              <p id="projectPage-description">
                {ReactHtmlParser(props.description)}
              </p>
            </div>

            <div id="projectPage-creator">
              <div id="projectPage-creator-picandname">
                <img
                  id="projectPage-creator-profilePic"
                  src={props.creatorProfilePic}
                />
                <div id="projectPage-creator-info">
                  <h4>{props.creator}</h4>
                  <p id="creator-createdOn">{props.createdOn}</p>
                </div>
              </div>
              <p id="creator-bio">{props.bio}</p>
              {!owner && (
                <div id="creator-message-buttons">
                  <button id="sendMessage-button" onClick={() => userCheck()}>
                    Send Message
                  </button>
                  <button id="sendMessage-button" onClick={() => sendReport()}>
                    Report
                  </button>
                </div>
              )}
            </div>

            <button id="showReviews-button" onClick={() => loadReviews()}>
              Show&nbsp;Reviews
            </button>
            {seeReviews && (
              <div className="project-page-review-container">
                <h2>Reviews</h2>
                <div className="project-page-reviews">
                  {reviews.map((review) => (
                    <div key={review.title}>
                      <ReviewCard
                        username={review.username}
                        stars={review.stars}
                        review={review.review}
                        reviewerPic={review.reviewerPic}
                        createdAt={review.createdAt}
                        reviewTitle={review.reviewTitle}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!owner && <RatingProject projectName={props.title} />}
          </>
        )}

        {/* 
              ************** add photo changes to edit project menu!!!!!!**************
                
                <div className={ owner ? "project-page-photo-owner" : "project-page-photo"} onClick={ owner ? () => openChangePhotoMenu(photoNumber) : ""}>
                  <img  className="project-page-photo-img" src={activePhoto} />   
                  <div className="middle-of-projectPic">                                
                      <i class="fas fa-camera-retro"></i>                                
                  </div>         
                </div>
                <div className="project-page-photo-thumbnails">

                  <div className="project-page-photo-thumbnail">
                    <img  className="project-page-photo-img" src={props.photo1}  onClick={(e) => setActivePhotos(e.currentTarget.src, 0)}/>
                  </div>

                  {(props.photo2 || owner) &&
                  <div className="project-page-photo-thumbnail">
                    {!props.photo2 && 
                    <div id="add-photo-icon"onClick={() => openChangePhotoMenu(1)}>
                      <i class="fas fa-plus" ></i>
                    </div>
                    }
                    {props.photo2 && <img  className="project-page-photo-img" src={props.photo2}  onClick={(e) => setActivePhotos(e.currentTarget.src, 1)}/>}
                  </div>
                  }

                  {(props.photo3 || owner) &&
                  <div className="project-page-photo-thumbnail">
                    {!props.photo3 && 
                      <div id="add-photo-icon"onClick={() => openChangePhotoMenu(2)}>
                        <i class="fas fa-plus" ></i>
                      </div>
                    }
                    {props.photo3 && <img  className="project-page-photo-img" src={props.photo3} onClick={(e) => setActivePhotos(e.currentTarget.src, 2)}/>}
                  </div>
                  }
                </div>                  
                { (owner ) && <p id="change-photo-project-text">Click/Tap a thumbnail to change it</p>} */}

        {openChangePhoto && (
          <div className="update-profile-background">
            <div className="update-projectPhoto-container">
              <div className="update-projectPhoto-container-wrapper">
                <div className="update-projectPhoto-header">
                  <h3 className="update-projectPhoto-title">
                    Choose a Picture
                  </h3>
                  <img
                    id="exitMenu"
                    src={Exit}
                    onClick={() => {
                      setOpenChangePhoto(false);
                    }}
                  />
                </div>
                <div className="update-projectPhoto-photo-container">
                  <img
                    className="project-page-photo-img"
                    src={activePhoto}
                    alt=""
                  />
                </div>
                <form className="form-input-container">
                  <div>
                    {/* <form onSubmit={onSubmitPhoto}> */}
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
                      <button
                        id="updateProjectPhoto-submit"
                        onClick={() => onSubmitPhoto()}
                      >
                        Change Photo
                      </button>
                      <button
                        id="updateProjectPhoto-close"
                        onClick={() => {
                          setOpenChangePhoto(false);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
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
          projectPhoto1={props.photo2}
          projectPhoto2={props.photo3}
          twitter={props.twitter}
          telegram={props.telegram}
          discord={props.discord}
          linkedIn={props.linkedIn}
          youtube={props.youtube}
          twitch={props.twitch}
          isOwner={owner}
          blockchains={props.blockchains}
          featureTags={props.featureTags}
        />
      )}
    </>
  );
}

export default ProjectDisplay;
