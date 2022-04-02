import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMoralis } from "react-moralis";
import UserProfile from "./UserProfile";
import AboutUser from "./AboutUser";
import ProjectCard from "./ProjectCard";
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

  let init = 0;

  const loadProfile = async () => {
    const params = { userUsername: username };
    const profile = await Moralis.Cloud.run("userProfileData", params);
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
      <HelmetMetaData
        description={profileLoaded[0].bio}
        title={username}
        image={profileLoaded[0].profilePic}
        path={`/profiles/${username}`}
      ></HelmetMetaData>
      <div className="page-container">
        <div className="page-wrapper">
          <div className="profile-container">
            {profileLoaded.map((userProfile) => (
              <UserProfile
                username={userProfile.username}
                profilePic={userProfile.profilePic}
                userLocation={userProfile.userLocation}
                skills={userProfile.skills}
                website={userProfile.website}
                bio={userProfile.bio}
                createdOn={userProfile.createdAt}
                landscapePic={userProfile.landscapePic}
                story={userProfile.story}
                twitter={userProfile.twitter}
                telegram={userProfile.telegram}
                discord={userProfile.discord}
                linkedIn={userProfile.linkedIn}
                twitch={userProfile.twitch}
                youtube={userProfile.youtube}
                isSaved={isSaved}
              />
            ))}
          </div>
          <div className="sub-profile-container">
            <div className="sub-profile-wrapper">
              <div className="aboutme-container">
                {!userPage && (
                  <button
                    className="send-msg-button btn2"
                    onClick={() => userCheck()}
                  >
                    Send Message
                  </button>
                )}
                <div className="socialShareLinks">
                  <EmailShareButton
                    url={`https://viralcrypto.app/profiles/${username}`}
                    id="socialShareLink"
                  >
                    <EmailIcon size={36} round={false} />
                  </EmailShareButton>
                  <FacebookShareButton
                    quote={profileLoaded[0].bio}
                    url={`https://viralcrypto.app/profiles/${username}`}
                    id="socialShareLink"
                  >
                    <FacebookIcon size={36} round={false} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={`https://viralcrypto.app/profiles/${username}`}
                    id="socialShareLink"
                  >
                    <TwitterIcon size={36} round={false} />
                  </TwitterShareButton>
                  <PinterestShareButton
                    description={profileLoaded[0].bio}
                    media={profileLoaded[0].profilePic}
                    url={`https://viralcrypto.app/profiles/${username}`}
                    id="socialShareLink"
                  >
                    <PinterestIcon size={36} round={false} />
                  </PinterestShareButton>
                  <TelegramShareButton
                    url={`https://viralcrypto.app/profiles/${username}`}
                    id="socialShareLink"
                  >
                    <TelegramIcon size={36} round={false} />
                  </TelegramShareButton>
                </div>

                <div className="aboutme-wrapper">
                  {profileLoaded.map((userProfile) => (
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
                {!userPage && (
                  <button
                    className="report-button btn1"
                    onClick={() => sendReport()}
                  >
                    Report
                  </button>
                )}
              </div>
              <div className="profile-action-container">
                <div className="profile-action-wrapper">
                  <div className="project-section-title">
                    <h3>{username}'s Projects</h3>
                  </div>
                  <div className="project-grid-container">
                    <div className="my-project-grid-wrapper">
                      {projects.map((listItem) => (
                        <div key={listItem.title} className="project-grid-box">
                          <ProjectGridBox
                            title={listItem.title}
                            summary={listItem.summary}
                            src={listItem.projectPhoto}
                            username={listItem.username}
                            creatorProfilePic={listItem.profilePic}
                            createdOn={listItem.createdOn}
                            label={listItem.username}
                            path={listItem.title}
                            isVerified={listItem.isVerified}
                            isLive={listItem.isLive}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="pagination">
                      <button
                        className="pagination-prev"
                        onClick={() => PagPrev()}
                      >
                        <i class="fas fa-caret-square-left"></i>PREV
                      </button>
                      <button
                        className="pagination-next"
                        onClick={() => PagNext()}
                      >
                        NEXT<i class="fas fa-caret-square-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      </div>
    </>
  );
};
export default UserProfilePage;
