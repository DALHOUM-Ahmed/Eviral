import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./User.css";
import {
  useMoralis,
  useMoralisFile,
  useMoralisWeb3Api,
  useWeb3ExecuteFunction,
  useApiContract,
} from "react-moralis";
import Logo from "../img/vceth.png";
import LogoBSC from "../img/vcbsc.png";
import defaultProfile from "../img/defaultProfile.png";
import defaultLandscape from "../img/defaultLandscape.jpg";
import Alert from "./Alert";
import CreateNewProject from "./CreateProject";

import "../components/ProfilePage.css";
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
import addImage from "../img/addImage.svg";
import Exit from "../img/exit.svg";
import ABI from "./TokenRewards-ABI";
import NFTABI from "./NFTABI";
const Moralis = require("moralis");

function Profile(props) {
  const { user, Moralis, isInitialized, refetchUserData } = useMoralis();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { data, fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

  const [profilePic, setProfilePic] = useState("");
  const [landscape, setLandscape] = useState("");

  const [balanceETH, setBalanceETH] = useState(0);

  const [changeProfilePicMenu, setOpenChangeProfilePicMenu] = useState(false);
  const [photoFile, setPhotoFile] = useState();
  const [photoFileName, setPhotoFileName] = useState();
  const [previewPic, setPreviewPic] = useState();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContents, setAlertContents] = useState();
  const [rewardData, setRewardData] = useState([, ,]);
  const [functionABI, setFunctionABI] = useState();

  // const {native: { runContractFunction },} = useMoralisWeb3Api();

  const onChangePhoto = (e) => {
    setPhotoFile(e.target.files[0]);
    setPhotoFileName(e.target.files[0].name);
    setPreviewPic(URL.createObjectURL(e.target.files[0]));
  };

  const onSubmitPhoto = async (e) => {
    const file = photoFile;
    const name = photoFileName;
    let fileIpfs = await saveFile(name, file, { saveIPFS: true });
    user.set("profilePic", fileIpfs);
    await user.save();
    setProfilePic(user.attributes.profilePic._url);
    setAlertContents("Uploaded!");
    setAlertVisible(true);
  };

  const renderBalance = async () => {
    const eViralBalance = await Moralis.Web3.getERC20({
      tokenAddress: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
    });
    const eBalance = eViralBalance.balance / 10 ** 18;
    const balance = eBalance.toFixed(0);
    setBalanceETH(balance);
  };

  const editProfileCheck = async () => {
    const _nftBalance = await Moralis.Web3API.native.runContractFunction({
      address: "0x9dd13E8Fce9e6dE73D2Df9e3411C93F04E28AF2B",
      function_name: "balanceOf",
      abi: NFTABI,
      params: {
        account: user.attributes.ethAddress,
        id: "0",
      },
    });
    console.log("NFTBALANCE", _nftBalance);
    if (balanceETH == 0 && _nftBalance == 0) {
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
    } else {
      props.openEditProfileMenu(true);
    }
  };

  const verificationEmail = async () => {
    const name = user?.attributes?.username;
    const params = { profileName: name };
    try {
      await Moralis.Cloud.run("sendProfileVerifyEmail", params);
    } catch (error) {
      alert(error);
    }
  };

  const userCheck = async () => {
    const _nftBalance = await Moralis.Web3API.native.runContractFunction({
      address: "0x9dd13E8Fce9e6dE73D2Df9e3411C93F04E28AF2B",
      function_name: "balanceOf",
      abi: NFTABI,
      params: {
        account: user.attributes.ethAddress,
        id: "0",
      },
    });
    if (balanceETH == 0 && _nftBalance == 0) {
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
      setOpenChangeProfilePicMenu(true);
    }
  };

  const claimRewardsData = {
    contractAddress: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
    functionName: "claim",
    abi: ABI,
  };

  const LoadRewardsForUser = async () => {
    const _rewardData = await Moralis.Web3API.native.runContractFunction({
      address: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
      function_name: "getAccountDividendsInfo",
      abi: ABI,
      params: {
        _account: user.attributes.ethAddress,
      },
    });
    const totalDividends = Moralis.Units.FromWei(
      _rewardData.totalDividends,
      18
    );
    const withdrawableDividends = parseInt(_rewardData.withdrawableDividends);
    const secondsUntilAutoClaimAvailable = parseInt(
      _rewardData.secondsUntilAutoClaimAvailable
    );
    setRewardData([
      totalDividends,
      withdrawableDividends,
      secondsUntilAutoClaimAvailable,
    ]);
  };

  const claim = async () => {
    await Moralis.enableWeb3();
    await fetch({ params: claimRewardsData });
  };

  useEffect(() => {
    LoadRewardsForUser();
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (user) {
        if (typeof user.attributes?.profilePic?._url === "undefined") {
          setProfilePic(defaultProfile);
        } else {
          setProfilePic(user.attributes?.profilePic?._url);
        }
        if (typeof user.attributes?.landscapePic?._url === "undefined") {
          setLandscape(defaultLandscape);
        } else {
          setLandscape(user.attributes?.landscapePic?._url);
        }
        setPreviewPic(profilePic);
        renderBalance();
        refetchUserData();
      }
    }
  }, [isInitialized]);

  return (
    <>
      <div id="profilePage-profile">
        <img id="profilePage-landscapePic" src={landscape} />
        <div id="profilePage-profileContainer">
          <div id="profilePage-profilePic">
            <img
              id="profilePage-profilePic"
              src={profilePic}
              onClick={() => userCheck()}
            />
            <div className="middle-of-profilePic" onClick={() => userCheck()}>
              <img src={addImage} />
            </div>
          </div>
          <div id="profilePage-profileInfo">
            <div id="profilePage-usernameandbio">
              <div id="profilePage-username">
                <h2>{user?.attributes?.username}</h2>
                <p>{user?.attributes?.bio}</p>
              </div>
              <div id="myprofile-header-buttons">
                <button id="subProfile-button" onClick={editProfileCheck}>
                  Edit&nbsp;Profile
                </button>
                <button
                  id="subProfile-button"
                  onClick={() => verificationEmail()}
                >
                  Get&nbsp;Verified
                </button>
              </div>
            </div>
            <div id="profilePage-payrate">
              {user?.attributes?.contactForPricing ? (
                <p>Contact for pricing</p>
              ) : (
                <>
                  {user?.attributes?.startRate}&nbsp;
                  {user?.attributes?.payCurrency}&nbsp;
                  {user?.attributes?.rate && (
                    <>
                      /&nbsp;
                      {user?.attributes?.rate}
                    </>
                  )}
                </>
              )}
            </div>
            <p>{ReactHtmlParser(user?.attributes?.story)}</p>
            <div id="skillTags">
              <p>Skillset:</p>
              {user?.attributes?.skillSet && (
                <>
                  {user.attributes.skillSet.map((element) => (
                    <div id="profile-skillTags">{element}</div>
                  ))}
                </>
              )}
            </div>
            <div id="mysocialShares">
              <p>Socials:</p>
              <Link
                id="myprofile-social-icon twitter"
                to={{
                  pathname: `https://twitter.com/${user?.attributes?.twitter}`,
                }}
                target="_blank"
                aria-label="Twitter"
              >
                <img id="socialShareIcon" src={shareTwitter} />
              </Link>
              <Link
                id="myprofile-social-icon telegram"
                to={{ pathname: `https://t.me/${user?.attributes?.telegram}` }}
                target="_blank"
                aria-label="Telegram"
              >
                <img id="socialShareIcon" src={shareTelegram} />
              </Link>
              <Link
                id="myprofile-social-icon linkedIn"
                to={{
                  pathname: `https://linkedin.com/in/${user?.attributes?.linkedIn}`,
                }}
                target="_blank"
                aria-label="LinkedIn"
              >
                <img id="socialShareIcon" src={shareLinkedIn} />
              </Link>
              <Link
                id="myprofile-social-icon youtube"
                to={{
                  pathname: `https://youtube.com/c/${user?.attributes?.youtube}`,
                }}
                target="_blank"
                aria-label="Youtube"
              >
                <img id="socialShareIcon" src={shareYoutube} />
              </Link>
              <Link
                id="myprofile-social-icon twitch"
                to={{
                  pathname: `https://twitch.tv/${user?.attributes?.twitch}`,
                }}
                target="_blank"
                aria-label="Twitch"
              >
                <img id="socialShareIcon" src={shareTwitch} />
              </Link>
            </div>
            <div id="profilePage-location">
              <img id="socialShareIcon" src={location} />
              <p>{user?.attributes?.userLocation}</p>
            </div>
            <div id="profilePage-website">
              <div>
                <Link
                  className="website-link"
                  to={{ pathname: `https://${user?.attributes?.website}` }}
                  target="_blank"
                >
                  <img id="websiteIcon" src={websiteIcon} />
                  {user?.attributes?.website}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div id="myProfilePage-subProfileMenu">
          <div id="profile-balances-wrapper">
            <div id="showProfileBalance">
              <img id="tokenBalanceSymbol" src={Logo} alt=""></img>
              <p>{balanceETH}</p>
            </div>
          </div>
          <div id="myProfilePage-rewardsInfo">
            <h5>
              Total&nbsp;Rewards: <span>{rewardData[0]}</span>
            </h5>
            <h5>
              Claimable:<span>{rewardData[1] && rewardData[1] / 10 ** 18}</span>
            </h5>
            <h5>
              Time&nbsp;Left&nbsp;to&nbsp;Claim:{" "}
              <span>{rewardData[2]} sec</span>
            </h5>
          </div>
          <button id="subProfile-button" onClick={() => claim()}>
            Claim
          </button>
        </div>
      </div>

      {changeProfilePicMenu && (
        <div className="update-profile-background">
          <div className="update-profilePic-container">
            <div className="update-profilepic-container-wrapper">
              <div className="update-profilepic-header">
                <h3 className="update-profile-title">
                  Choose a Profile Picture
                </h3>
                <img
                  id="exitMenu"
                  src={Exit}
                  onClick={() => {
                    setOpenChangeProfilePicMenu(false);
                  }}
                />
              </div>
              <div id="profilePage-update-profilePic">
                <img
                  id="profilePage-update-profilePic"
                  src={previewPic}
                  onClick={() => userCheck()}
                />
              </div>
              <form className="form-input-container">
                <form onSubmit={onSubmitPhoto}>
                  <div className="mb-3">
                    <label htmlFor="profilePhoto" className="form-label">
                      Select Image File
                      <br />
                      (If you have trouble uploading, make sure the file name
                      contains no special characters.)
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
                      onClick={onSubmitPhoto}
                    />
                    <button
                      className="upload-profilePic-button1"
                      onClick={() => {
                        setOpenChangeProfilePicMenu(false);
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
      {alertVisible && (
        <Alert visible={setAlertVisible} content={alertContents} />
      )}
    </>
  );
}

export default Profile;
