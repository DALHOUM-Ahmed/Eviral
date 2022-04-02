import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Header.css";
import { useMoralis } from "react-moralis";
import avatar from "../../img/defaultProfile.png";
import mmLogo from "../../img/metamask.png";
import wcLogo from "../../img/walletconnect.png";
import "../../components/NavbarConnectMenu.css";
import Alert from "../../components/Alert";
// import Logo from '../../img/newlogo2.png';
// import LogoBSC from '../../img/newlogoBSC2.png';
import DesktopLogo from "../../img/headerfulllogo.svg";
import Logo from "../../img/vceth.png";
import LogoBSC from "../../img/vcbsc.png";

import MenuBars from "../../img/menubars.svg";
import MenuExit from "../../img/menuexit.svg";

function Navbar() {
  const { authenticate, isAuthenticated, user, logout, auth, Moralis } =
    useMoralis();

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceBSC, setBalanceBSC] = useState(0);
  const [profilePic, setProfilePic] = useState();
  const [username, setUsername] = useState("Username");
  const [displayConnect, setDisplayConnect] = useState(true);

  const [connectMenu, setOpenConnectMenu] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const authenticateUserMM = async () => {
    let user = Moralis.User.current();
    if (!user) {
      if (!isAuthenticated) {
        try {
          await authenticate({
            signingMessage:
              "Welcome to Viral Crypto. Please Authenticate your address.",
          });
        } catch (error) {
          alert(error);
        } finally {
          if (isAuthenticated) {
            renderBalance();
            setProfilePic(user.attributes?.profilePic?._url);
            setUsername(user.attributes?.username);
          }
        }
      }
    }
    setOpenConnectMenu(false);
  };

  const authenticateUserWC = async () => {
    let user = Moralis.User.current();
    if (!user) {
      if (!isAuthenticated) {
        try {
          await authenticate({ provider: "walletconnect" });
        } catch (error) {
          alert(error);
        } finally {
          if (isAuthenticated) {
            renderBalance();
            setProfilePic(user.attributes?.profilePic?._url);
            setUsername(user.attributes?.username);
          }
        }
      }
    }
    setOpenConnectMenu(false);
  };

  const logoutUser = async () => {
    await logout();
    setDisplayConnect(true);
    setProfilePic(avatar);
    const goHome = () => {
      window.location.href = "/";
    };
    goHome();
  };

  const renderBalance = async () => {
    const eViralBalance = await Moralis.Web3.getERC20({
      tokenAddress: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
    });
    // const beViralBalance = await Moralis.Web3.getERC20({chain:'bsc', tokenAddress: '0x7CeC018CEEF82339ee583Fd95446334f2685d24f'});
    const eBalance = eViralBalance.balance / 10 ** 18;
    // const bBalance = beViralBalance.balance/(10**9);
    const balance = eBalance.toFixed(0);
    // const bvBalance = (bBalance.toFixed(0));
    setBalance(balance);
    // setBalanceBSC(bvBalance);
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    if (user) {
      setProfilePic(user.attributes?.profilePic?._url);
      setUsername(user.attributes.username);
      renderBalance();
    }
  }, [user]);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="header">
        <Link to="/" className="navbar-logo">
          <img id="navbarlogo" src={DesktopLogo} />
        </Link>

        <ul className="navbar-links-container">
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link
                className="nav-links"
                to={{ pathname: `https://vcmint.netlify.app/` }}
                target="_blank"
              >
                Mint
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/projects"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profiles"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Profiles
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item" onClick={closeMobileMenu}>
                  <Link to="/chat" className="nav-links">
                    Chat
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/wallet"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Wallet
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link
                to={{ pathname: `https://eviral.site` }}
                target="_blank"
                className="nav-links"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </ul>

        <div className="navbar-connect">
          <li className="nav-item">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <div className="avatarPic-wrapper">
                    <img className="avatarPic" src={profilePic} />
                  </div>
                </li>
                <div className="caret">
                  <i>
                    <img
                      id="header-menuBars"
                      src={MenuBars}
                      onClick={() => {
                        setDropdown(!dropdown);
                      }}
                    />
                    {dropdown && (
                      <div className="dropdown">
                        <h2 id="dropdown-username"> {username}</h2>
                        <li className="dropdown-item">
                          <div className="wallet-balances">
                            <div className="showBalance">
                              <img
                                className="eViralLogo-Dropdown"
                                src={Logo}
                                alt=""
                              ></img>
                              {balance}
                            </div>
                            {/* <div className="showBalanceBSC">
                                                <img className="eViralLogo-Dropdown" src={LogoBSC} alt="" ></img>
                                                {balanceBSC}
                                            </div> */}
                          </div>
                        </li>
                        <Link
                          to="/myprofile"
                          onClick={() => {
                            setDropdown(!dropdown);
                          }}
                          className="dropdown-item"
                        >
                          <h4 id="dropDown-text">My&nbsp;Profile</h4>
                        </Link>
                        <Link
                          to={{ pathname: `https://vcmint.netlify.app/` }}
                          target="_blank"
                          onClick={() => {
                            setDropdown(!dropdown);
                          }}
                          className="dropdown-item"
                        >
                          <h4 id="dropDown-text">Mint</h4>
                        </Link>
                        <Link
                          to="/projects"
                          onClick={() => {
                            setDropdown(!dropdown);
                          }}
                          className="dropdown-item"
                        >
                          <h4 id="dropDown-text">Projects</h4>
                        </Link>
                        <Link
                          to="/profiles"
                          onClick={() => {
                            setDropdown(!dropdown);
                          }}
                          className="dropdown-item"
                        >
                          <h4 id="dropDown-text">Profiles</h4>
                        </Link>

                        <Link
                          to="/chat"
                          onClick={() => {
                            setDropdown(!dropdown);
                          }}
                          className="dropdown-item"
                        >
                          <h4 id="dropDown-text">Messages</h4>
                        </Link>
                        <Link
                          to="/wallet"
                          onClick={() => {
                            setDropdown(!dropdown);
                          }}
                          className="dropdown-item"
                        >
                          <h4 id="dropDown-text">Wallet</h4>
                        </Link>

                        <li className="dropdown-logout">
                          <button
                            className="btn2 logout-btn"
                            onClick={() => logoutUser()}
                          >
                            Log&nbsp;Out
                            <i class="fas fa-sign-out-alt"></i>
                          </button>
                          <button
                            className="btn1  logout-btn"
                            onClick={() => {
                              setDropdown(!dropdown);
                            }}
                          >
                            Close
                          </button>
                        </li>
                      </div>
                    )}
                  </i>
                </div>
              </>
            )}
          </li>
          {!isAuthenticated && (
            <button
              className="safeconnectbutton"
              onClick={() => setOpenConnectMenu(true)}
            >
              Sign&nbsp;In
            </button>
          )}
          {/* <div className='menu-icon' onClick={handleClick}>
                        <img src={ click ? MenuExit : MenuBars}/>
                    </div>    */}
          {connectMenu && (
            <div className="connectMenu-background">
              <div className="connectMenu-container">
                <div className="connectMenu-wrapper">
                  <div className="connectMenu-title">
                    <h3>Connect Your Wallet</h3>
                  </div>
                  <div className="connectMenu-options">
                    <div
                      className="connectMenu-metamask"
                      onClick={() => authenticateUserMM()}
                    >
                      <button className="connectMenu-btn">
                        <img className="metamask-logo" src={mmLogo} />
                      </button>
                    </div>
                    <div className="connectMenu-walletConnect">
                      <button className="connectMenu-btn">
                        <img
                          className="walletconnect-logo"
                          src={wcLogo}
                          onClick={() => authenticateUserWC()}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="connectMenu-footer">
                    <button onClick={() => setOpenConnectMenu(false)}>
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
