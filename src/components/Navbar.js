import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Navbar.css";
import { Button } from "./Button";
import { useMoralis } from "react-moralis";
import roundLogo from "../img/roundlogo.png";
import eViralLogo from "../img/eViralLogo2.png";
import beViralLogo from "../img/beviral.png";
import avatar from "../img/defaultProfile.png";
import mmLogo from "../img/metamask.png";
import wcLogo from "../img/walletconnect.png";
import "./DropdownMenu.css";
import "./NavbarConnectMenu.css";
import Alert from "./Alert";
import Logo from "../img/newlogo2.png";
import LogoBSC from "../img/newlogoBSC2.png";
import NavbarLogo from "../img/navbarlogo.png";

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
    console.log(1);
    if (!isAuthenticated) {
      try {
        await authenticate();
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
    setOpenConnectMenu(false);
  };

  const authenticateUserWC = async () => {
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
    const eBalance = eViralBalance.balance / 10 ** 9;

    const balance = eBalance.toFixed(0);

    setBalance(balance);
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
      <nav className="navbar">
        <div className="navbar-nav">
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className="navbar-logo">
            <Link to="/" className="navbar-logo">
              <div className="viralcrypto">
                <img id="navbarlogo" src={NavbarLogo} />
              </div>
              {/* <img className="roundLogo" src={roundLogo} alt="" />                   */}
            </Link>
          </ul>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                <i class="fas fa-home"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/projects"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <i class="fas fa-tasks"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profiles"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <i class="fas fa-people-arrows"></i>
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item" onClick={closeMobileMenu}>
                  <Link to="/chat" className="nav-links">
                    <i class="far fa-comments"></i>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/wallet"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    <i class="fas fa-wallet"></i>
                  </Link>
                </li>
                {/* <li className='nav-item'>
                                    <Link to='/swap' className='nav-links' onClick={closeMobileMenu}>
                                    <i class="fas fa-sync-alt"></i>
                                    </Link>
                                </li> */}
              </>
            )}
          </ul>

          <div className="navbar-user">
            <li className="nav-item">
              <div className="avatarPic-wrapper">
                <img className="avatarPic" src={profilePic} />
              </div>
            </li>
            <li className="nav-item">
              {isAuthenticated && (
                <div className="caret">
                  <i
                    class="fas fa-caret-down"
                    onClick={() => {
                      setDropdown(!dropdown);
                    }}
                  >
                    {dropdown && (
                      <div className="dropdown">
                        <li className="dropdown-item-user">
                          <span className="dropdown-icon"></span>
                          <img className="avatarPic" src={profilePic} />
                          <span className="dropdown-username"> {username}</span>
                          <span className="dropdown-right-icon"></span>
                        </li>
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
                            <div className="showBalanceBSC">
                              <img
                                className="eViralLogo-Dropdown"
                                src={LogoBSC}
                                alt=""
                              ></img>
                              {balanceBSC}
                            </div>
                          </div>
                        </li>
                        <Link to="/myprofile" className="dropdown-item">
                          <span className="dropdown-icon">
                            <i class="far fa-user"></i>
                          </span>
                          My Profile
                        </Link>

                        <Link to="/chat" className="dropdown-item">
                          <span className="dropdown-icon">
                            <i class="fas fa-comments"></i>
                          </span>
                          Messages
                        </Link>
                        <Link to="/wallet" className="dropdown-item">
                          <span className="dropdown-icon">
                            <i class="fas fa-wallet"></i>
                          </span>
                          My Wallet
                        </Link>

                        <li className="dropdown-logout">
                          <button
                            className="btn1  logout-btn"
                            onClick={() => {
                              setDropdown(!dropdown);
                            }}
                          >
                            Close
                          </button>
                          <button
                            className="btn2 logout-btn"
                            onClick={() => logoutUser()}
                          >
                            Log&nbsp;Out
                            <i class="fas fa-sign-out-alt"></i>
                          </button>
                        </li>
                      </div>
                    )}
                  </i>
                </div>
              )}
            </li>
            {!isAuthenticated && (
              <button className="btn1" onClick={() => setOpenConnectMenu(true)}>
                Safe&nbsp;Connect
              </button>
            )}
            {connectMenu && (
              <div className="connectMenu-background">
                <div className="connectMenu-container">
                  <div className="connectMenu-wrapper">
                    <div className="connectMenu-title">
                      <h3>Connect with Web3</h3>
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
        </div>
      </nav>
    </>
  );
}

export default Navbar;
