import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMoralis } from "react-moralis";
import UserProfile from "./UserProfile";
import AboutUser from "./AboutUser";
import ProjectCard from "../components/V2/ProjectCard";
import Carousel from "./Carousel";
import SendMessagePopUp from "./SendMessagePopUp";
import Alert from "./Alert";
import ProjectGridBox from "./ProjectGridBox";
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
import HelmetMetaData from "./HelmetMetaData";
import { Helmet } from "react-helmet";
import SaveProfile from "./SaveProfile";
import "./ProfilePage.css";
import ReactHtmlParser from "react-html-parser";

import shareTelegram from "../img/shareIcons/telegram.svg";
import shareTwitter from "../img/shareIcons/twitter.svg";
import shareLinkedIn from "../img/shareIcons/linkedin.svg";
import shareEmail from "../img/shareIcons/email.svg";
import shareFacebook from "../img/shareIcons/facebook.svg";
import sharePinterest from "../img/shareIcons/pinterest.svg";
import shareYoutube from "../img/shareIcons/youtube.svg";
import shareTwitch from "../img/shareIcons/twitch.svg";
import websiteIcon from "../img/projectpage/websiteicon.svg";
import location from "../img/location.svg";
import SocialIconBar from "./SocialIconBar";

const UserProfilePage = ({ data }) => {
  const { user, Moralis, isInitialized } = useMoralis();
  const { username } = useParams();

  const [profileLoaded, setProfileLoaded] = useState([""]);
  const [projects, setProjects] = useState([""]);
  const [sendMessagePopUpVisible, setSendMessagePopUpVisible] = useState(false);
  const [userPage, setUserPage] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContents, setAlertContents] = useState();

  const [pageNumber, setPageNumber] = useState(0);

  const [twitterActive, setTwitterActive] = useState(true);
  const [youtubeActive, setYoutubeActive] = useState(true);
  const [telegramActive, setTelegramActive] = useState(true);
  const [discordActive, setDiscordActive] = useState(true);
  const [linkedInActive, setLinkedInActive] = useState(true);
  const [twitchActive, setTwitchActive] = useState(true);

  let init = 0;

  const loadProfile = async () => {
    const params = { userUsername: username };
    const profile = await Moralis.Cloud.run("userProfileData", params);
    console.log(profile);
    setProfileLoaded(profile);
    checkUserPage();
  };

  const loadProfileProjects = async () => {
    const params = { userUsername: username, skipAmount: pageNumber };
    const projectsList = await Moralis.Cloud.run("renderUserProjects", params);
    setProjects(projectsList);
  };

  const PagPrev = () => {
    if (pageNumber == 0) {
      return;
    }
    let prevPageNumber = pageNumber - 1;
    setPageNumber(prevPageNumber);
  };

  const PagNext = () => {
    let nextPageNumber = pageNumber + 1;
    setPageNumber(nextPageNumber);
  };

  const checkUserPage = () => {
    const userLoaded = profileLoaded[0].username;
    const userVisiter = user.attributes?.username;
    if (userLoaded == userVisiter) {
      setUserPage(true);
    } else {
      setUserPage(false);
    }
  };

  const userCheck = async () => {
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

  const checkSavedProfile = async () => {
    const params = { profileName: username };
    const results = await Moralis.Cloud.run("checkIfSavedProfile", params);

    if (results[0]) {
      setIsSaved(true);
    }
  };

  const sendReport = async () => {
    const params = { profileName: username };
    console.log(params);
    try {
      await Moralis.Cloud.run("sendReportProfileEmail", params);
      console.log("emailSent");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      checkSavedProfile();
      loadProfile();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      loadProfileProjects();
    }
  }, [pageNumber, isInitialized]);

  return (
    <>
      <div id="profilePage-profile">
        <img
          id="profilePage-landscapePic"
          src={profileLoaded[0].landscapePic}
        />
        <div id="profilePage-profileContainer">
          <img id="profilePage-profilePic" src={profileLoaded[0].profilePic} />
          <div id="profilePage-profileInfo">
            <div id="profilePage-usernameandbio">
              <div id="profilePage-username">
                <h2>{profileLoaded[0].username}</h2>
                <p>{profileLoaded[0].bio}</p>
              </div>
              <button id="sendMessage-button" onClick={() => userCheck()}>
                Send Message
              </button>
            </div>
            <div id="profilePage-payrate">
              {profileLoaded[0].contactForPricing ? (
                <p>Contact for pricing</p>
              ) : (
                <>
                  {profileLoaded[0].startRate}&nbsp;
                  {profileLoaded[0].payCurrency}&nbsp;
                  {profileLoaded[0].rate && (
                    <>
                      /&nbsp;
                      {profileLoaded[0].rate}
                    </>
                  )}
                </>
              )}
            </div>
            <p id="profilePage-story">
              {ReactHtmlParser(profileLoaded[0].story)}
            </p>
            <div id="skillTags">
              <p>Skillset:</p>
              {profileLoaded[0].skillSet && (
                <>
                  {profileLoaded[0].skillSet.map((element) => (
                    <div id="profile-skillTags">{element}</div>
                  ))}
                </>
              )}
            </div>
            <div id="profile-socialShares">
              <p>Socials:</p>
              {profileLoaded[0].twitter && (
                <Link
                  className="profile-social-icon twitter"
                  to={{
                    pathname: `https://twitter.com/${profileLoaded[0].twitter}`,
                  }}
                  target="_blank"
                  aria-label="Twitter"
                >
                  <img id="socialShareIcon" src={shareTwitter} />
                </Link>
              )}
              {profileLoaded[0].telegram && (
                <Link
                  className="profile-social-icon telegram"
                  to={{ pathname: `https://t.me/${profileLoaded[0].telegram}` }}
                  target="_blank"
                  aria-label="Telegram"
                >
                  <img id="socialShareIcon" src={shareTelegram} />
                </Link>
              )}
              {profileLoaded[0].linkedIn && (
                <Link
                  className="profile-social-icon linkedIn"
                  to={{
                    pathname: `https://linkedin.com/in/${profileLoaded[0].linkedIn}`,
                  }}
                  target="_blank"
                  aria-label="LinkedIn"
                >
                  <img id="socialShareIcon" src={shareLinkedIn} />
                </Link>
              )}
              {profileLoaded[0].youtube && (
                <Link
                  className="profile-social-icon youtube"
                  to={{
                    pathname: `https://youtube.com/c/${profileLoaded[0].youtube}`,
                  }}
                  target="_blank"
                  aria-label="Youtube"
                >
                  <img id="socialShareIcon" src={shareYoutube} />
                </Link>
              )}
              {profileLoaded[0].twitch && (
                <Link
                  className="profile-social-icon twitch"
                  to={{
                    pathname: `https://twitch.tv/${profileLoaded[0].twitch}`,
                  }}
                  target="_blank"
                  aria-label="Twitch"
                >
                  <img id="socialShareIcon" src={shareTwitch} />
                </Link>
              )}
            </div>
            <div id="profilePage-location">
              <img id="locationIcon" src={location} />
              <p>{profileLoaded[0].userLocation}</p>
            </div>
            <div id="profilePage-website">
              <div>
                <Link
                  className="website-link"
                  to={{ pathname: `https://${profileLoaded[0].website}` }}
                  target="_blank"
                >
                  <img id="websiteIcon" src={websiteIcon} />
                  {profileLoaded[0].website}
                </Link>
              </div>
            </div>
            <div id="profilePage-save">
              <SaveProfile
                profileName={profileLoaded[0].username}
                isSaved={profileLoaded[0].isSaved}
              />
            </div>
          </div>
        </div>
      </div>
      <div id="loadProjects-container">
        <div id="profilePage-projects">Projects</div>
        <div className="project-grid-wrapper">
          {projects.map((project) => (
            <div key={project.title}>
              <ProjectCard
                title={project.title}
                summary={project.summary}
                src={project.projectPhoto}
                username={project.username}
                creatorProfilePic={project.profilePic}
                createdOn={project.createdOn}
                path={project.title}
                isVerified={project.isVerified}
                isLive={project.isLive}
              />
            </div>
          ))}
        </div>
      </div>
      {sendMessagePopUpVisible && (
        <SendMessagePopUp
          visible={setSendMessagePopUpVisible}
          creatorProfilePic={profileLoaded[0].profilePic}
          creatorName={profileLoaded[0].username}
        />
      )}
      {alertVisible && (
        <Alert visible={setAlertVisible} content={alertContents} />
      )}
      <HelmetMetaData
        description={profileLoaded[0].bio}
        title={username}
        image={profileLoaded[0].profilePic}
        path={`/profiles/${username}`}
      ></HelmetMetaData>
      <Helmet>
        <meta
          property="og:url"
          content={`https://viralcrypto.app/profiles/${profileLoaded[0].username}`}
        />
        <meta property="og:title" content={profileLoaded[0].username} />
        <meta property="og:description" content={profileLoaded[0].bio} />
        <meta property="og:image" content={profileLoaded[0].profilePic} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={profileLoaded[0].twitter} />
        <meta name="twitter:title" content={profileLoaded[0].username} />
        <meta name="twitter:description" content={profileLoaded[0].bio} />
        <meta name="twitter:image" content={profileLoaded[0].profilePic} />
      </Helmet>

      {/*       
        <div className="page-container">
            <div className="page-wrapper">
                <div className="profile-container">
                    <div className="profile-wrapper">
                        <div className="profile-background">
                            <img className='landscape-pic' src={profileLoaded[0].landscapePic} alt=""/>   
                        </div>
                        <div className="profile-header">                        
                            <div className="profile-pic-container">
                                <img className="profile-pic" src={profileLoaded[0].profilePic} alt=""/>                        
                            </div>                        
                            <div className="profile-summary">
                                <h2 className="profile-page-username">{profileLoaded[0].username} </h2>
                                <p className="profile-page-bio">{profileLoaded[0].bio}</p>
                                                  
                            </div>
                            <div className="save-profile-wrapper">
                            <SaveProfile
                                profileName = {profileLoaded[0].username}
                                isSaved = {profileLoaded[0].isSaved}
                            />
                            </div>                     
                        </div>                
                    </div>                            
                </div>
                <div className="sub-profile-container">
                    <div className="sub-profile-wrapper">
                        <div className="aboutme-container">
                    {!userPage &&                  
                      <button 
                        className="send-msg-button btn2" 
                        onClick={() => userCheck()}
                      > 
                        Send Message
                      </button>
                    }
                    <div className="socialShareLinks">
                    <EmailShareButton  url={`https://viralcrypto.app/profiles/${username}`} id="socialShareLink">
                      <EmailIcon size={36} round={false}/>
                    </EmailShareButton>
                    <FacebookShareButton quote={profileLoaded[0].bio}  url={`https://viralcrypto.app/profiles/${username}`} id="socialShareLink">
                      <FacebookIcon size={36} round={false} />
                    </FacebookShareButton>
                    <TwitterShareButton   url={`https://viralcrypto.app/profiles/${username}`} id="socialShareLink">
                      <TwitterIcon size={36} round={false}/>
                    </TwitterShareButton>
                    <PinterestShareButton  description={profileLoaded[0].bio} media={profileLoaded[0].profilePic} url={`https://viralcrypto.app/profiles/${username}`} id="socialShareLink">
                      <PinterestIcon size={36} round={false}/>
                    </PinterestShareButton>
                    <TelegramShareButton  url={`https://viralcrypto.app/profiles/${username}`} id="socialShareLink">
                      <TelegramIcon size={36} round={false}/>
                    </TelegramShareButton>
                  </div>
                          
                            <div className="aboutme-wrapper">
                                {profileLoaded.map(userProfile => (  
                                  <AboutUser 
                                  website={userProfile.website}
                                  story={userProfile.story}
                                  userLocation={userProfile.userLocation}
                                  skills={userProfile.skills}
                                  website={userProfile.website} 
                                  twitter={userProfile.twitter}
                                  telegram={userProfile.telegram}
                                  discord={userProfile.discord}
                                  linkedIn={userProfile.linkedIn}
                                  twitch={userProfile.twitch}
                                  youtube={userProfile.youtube}                            
                                  />
                                ))}  
                            </div>
                            { !userPage &&
                            <button className="report-button btn1" onClick={() => sendReport()}>Report</button>
                            }
                        </div>                    
                        <div className="profile-action-container">
                            <div className="profile-action-wrapper">
                            <div className="project-section-title">
                                    <h3>{username}'s Projects</h3>               
                                </div>
                            <div className="project-grid-container">
                              <div className="my-project-grid-wrapper">
                                  {projects.map(listItem => (
                                      <div key={listItem.title} className="project-grid-box">
                                        <ProjectGridBox
                                        title={listItem.title}
                                        summary={listItem.summary}
                                        src={listItem.projectPhoto}
                                        username={listItem.username}
                                        creatorProfilePic={listItem.profilePic}
                                        createdOn = {listItem.createdOn}
                                        label={listItem.username}
                                        path={listItem.title}
                                        isVerified = {listItem.isVerified}
                                        isLive = {listItem.isLive}
                                        />
                                    </div>
                                    ))}
                                  </div>
                                <div className="pagination">
                                  <button className="pagination-prev" onClick={() => PagPrev()}><i class="fas fa-caret-square-left"></i>PREV</button>              
                                  <button className="pagination-next" onClick={() => PagNext()}>NEXT<i class="fas fa-caret-square-right"></i></button>
                                </div>
                              </div>
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>   

        </div>      */}
    </>
  );
};
export default UserProfilePage;
