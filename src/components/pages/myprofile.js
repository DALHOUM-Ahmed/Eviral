import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import Profile from "../Profile";
import { useMoralis } from "react-moralis";
import UpdateProfile from "../UpdateProfile.js";
import CreateProject from "../CreateProject.js";
import AboutMe from "../AboutMe";
import "../../components/User.css";
import LoadMyProjects from "../LoadMyProjects";
import Alert from "../Alert";
import ProjectCard from "../../components/V2/ProjectCard";
import ProfileCard from "../../components/V2/ProfileCard";
import ProjectGridBox from "../ProjectGridBox";
import NFTABI from "../NFTABI";

import "../../components/ProfilePage.css";
import ReactHtmlParser from "react-html-parser";

import Left from "../../img/leftpagination.png";
import Right from "../../img/rightpagination.png";
import Add from "../../img/add.svg";

import shareTelegram from "../../img/shareIcons/telegram.svg";
import shareTwitter from "../../img/shareIcons/twitter.svg";
import shareLinkedIn from "../../img/shareIcons/linkedin.svg";
import shareEmail from "../../img/shareIcons/email.svg";
import shareFacebook from "../../img/shareIcons/facebook.svg";
import sharePinterest from "../../img/shareIcons/pinterest.svg";
import shareYoutube from "../../img/shareIcons/youtube.svg";
import shareTwitch from "../../img/shareIcons/twitch.svg";
import websiteIcon from "../../img/projectpage/websiteicon.svg";
import location from "../../img/location.svg";

function MyProfile() {
  const { isInitialized, Moralis, user } = useMoralis();

  const [createProjectMenu, setOpenCreateProjectMenu] = useState(false);
  const [editProfileMenu, setOpenEditProfileMenu] = useState(false);
  const [savedProjects, setSavedProjects] = useState([""]);
  const [usersSaved, setUsersSaved] = useState([""]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContents, setAlertContents] = useState();

  const LoadSavedProjects = async () => {
    const savedProjectsList = await Moralis.Cloud.run("renderSavedProjects");
    setSavedProjects(savedProjectsList);
  };

  const LoadSavedProfiles = async () => {
    const savedProfiles = await Moralis.Cloud.run("loadSavedProfiles");
    setUsersSaved(savedProfiles);
  };

  const [projects, setProjects] = useState([""]);
  const [pageNumber, setPageNumber] = useState(0);

  const LoadProjects = async () => {
    const params = { page: pageNumber };
    const results = await Moralis.Cloud.run("renderMyProjects", params);
    setProjects(results);
    console.log(pageNumber);
    console.log(results);
  };

  const createProject = async () => {
    const _nftBalance = await Moralis.Web3API.native.runContractFunction({
      address: "0x9dd13E8Fce9e6dE73D2Df9e3411C93F04E28AF2B",
      function_name: "balanceOf",
      abi: NFTABI,
      params: {
        account: user.attributes.ethAddress,
        id: "0",
      },
    });
    const eViralBalance = await Moralis.Web3.getERC20({
      tokenAddress: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
    });
    const eBalance = eViralBalance.balance / 10 ** 9;
    const balance = eBalance.toFixed(0);
    if (balance == 0 && _nftBalance == 0) {
      setAlertContents(
        <>
          <div className="alert-popup-contents">
            You'll need to own either VC tokens or The Sentinel NFT to access
            this feature.
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
      setOpenCreateProjectMenu(true);
    }
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

  useEffect(() => {
    LoadProjects();
  }, [pageNumber]);

  useEffect(() => {
    if (isInitialized) {
      LoadSavedProjects();
      LoadSavedProfiles();
    }
  }, [isInitialized]);

  return (
    <div id="myProfilePage">
      <Profile
        openCreateProjectMenu={setOpenCreateProjectMenu}
        openEditProfileMenu={setOpenEditProfileMenu}
      />
      <div id="profilePage-projects">My Projects</div>
      <div className="project-grid-wrapper">
        <div id="createAProject" onClick={() => createProject()}>
          <img id="addProjectIcon" src={Add} />
          <h4 id="addProjectText">Add Project</h4>
        </div>
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
      <div className="pagination">
        <button className="pagination-prev" onClick={() => PagPrev()}>
          <img id="leftarrow" src={Left} />
        </button>
        <button className="pagination-next" onClick={() => PagNext()}>
          <img id="rightarrow" src={Right} />
        </button>
      </div>
      <div id="profilePage-projects">Saved Projects</div>
      <div className="project-grid-wrapper">
        {savedProjects.map((project) => (
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
      <div className="pagination">
        <button className="pagination-prev">
          <img id="leftarrow" src={Left} />
        </button>
        <button className="pagination-next">
          <img id="rightarrow" src={Right} />
        </button>
      </div>
      <div id="profilePage-projects">Following</div>
      <div className="profile-grid-wrapper">
        {usersSaved.map((userProfile) => (
          <div key={userProfile.username}>
            <ProfileCard
              bio={userProfile.bio}
              profilePic={userProfile.profilePic}
              username={userProfile.username}
              startRate={userProfile.startRate}
              payCurrency={userProfile.payCurrency}
            />
          </div>
        ))}
      </div>
      <div className="pagination">
        <button className="pagination-prev">
          <img id="leftarrow" src={Left} />
        </button>
        <button className="pagination-next">
          <img id="rightarrow" src={Right} />
        </button>
      </div>
      <div className="projects">
        {createProjectMenu && (
          <CreateProject closeCreateProjectMenu={setOpenCreateProjectMenu} />
        )}
        {editProfileMenu && (
          <UpdateProfile closeEditProfileMenu={setOpenEditProfileMenu} />
        )}
      </div>
      {alertVisible && (
        <Alert visible={setAlertVisible} content={alertContents} />
      )}
    </div>
  );
}

export default MyProfile;
