import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Link, useHistory } from "react-router-dom";
import Alert from "./Alert";
import "./ChatPage.css";
import ProfileMessageCard from "./ProfileMessageCard";
import ScrollableFeed from "react-scrollable-feed";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import ReactHtmlParser from "react-html-parser";
import Background1 from "../img/vcbackground.png";

function ChatPage() {
  const { user, Moralis, isInitialized } = useMoralis();
  const [inboxUsers, setInboxUsers] = useState();
  const [requestsUsers, setRequestsUsers] = useState();
  const [showInbox, setShowInbox] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [chatContent, setChatContent] = useState();
  const [chatDisplay, setChatDisplay] = useState(false);
  const [activeChatId, setActiveChatId] = useState();
  const [processRequest, setProcessRequest] = useState(false);
  const [reply, setReply] = useState("");
  const [noUsers, setNoUsers] = useState(false);
  const [numRequests, setNumRequests] = useState(0);
  const [notifyReq, setNotifyReq] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContents, setAlertContents] = useState();

  const handleReplyOnChange = (e, editor) => {
    const data = editor.getData();
    setReply(data);
  };

  const closeSidebarContent = () => {
    setShowInbox(false);
    setShowRequests(false);
  };

  const deletePopUp = async () => {
    setAlertContents(
      <div className="verify-delete-popup">
        This will delete entire chat history for both parites. Are you sure you
        want to proceed?
        <button className="submit-form btn3" onClick={deleteChat}>
          Yes. Delete{" "}
        </button>
        <button className="submit-form btn2" onClick={setAlertVisible(false)}>
          Close{" "}
        </button>
      </div>
    );
    setAlertVisible(true);
  };

  const deleteChat = async () => {
    // try{
    const Conversation = Moralis.Object.extend("Conversation");
    const findConversation = new Moralis.Query(Conversation);
    findConversation.equalTo("objectId", activeChatId);
    const conversationFound = await findConversation.find();
    const conversation = conversationFound[0];
    if (conversation.attributes.requestAccepted == false) {
      conversation.destroy().then(
        (object) => {
          alert("Chat deleted.");
        },
        (error) => {
          alert(error);
        }
      );
    } else {
      conversation.set("requestAccepted", false);
      await conversation.save();
      alert("Message removed.");
      await loadInboxProfiles();
    }

    const params = { projectTitle: 1 };
    console.log(params);
    const project = await Moralis.Cloud.run("getProjectByName", params);
    console.log(project);

    const currentProject = project;
    currentProject.destroy().then(
      (object) => {
        alert("You can always create something new!");
      },
      (error) => {
        alert(error);
      }
    );
  };

  const userCheck = async () => {
    const eViral = await Moralis.Web3.getERC20({
      tokenAddress: "0x56A5D6a4a78af419ae83c2a58D9a2cAaB28C5E60",
    });
    const balanceETH = eViral.balance;
    const hasProfile = user?.attributes?.profileCreated;
    if (balanceETH < 100) {
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
      return false;
    } else if (!hasProfile) {
      setAlertContents(
        <>
          <div className="alert-popup-contents">
            You'll need to set up a Profile to access this feature.
            <Link to="/myprofile">
              <button className="btn2">My Profile</button>
            </Link>
          </div>
        </>
      );
      setAlertVisible(true);
      return false;
    } else {
      return true;
    }
  };

  const init = 0;

  const CheckInboxClick = async () => {
    const auth = await userCheck();
    if (auth) {
      if (showInbox) {
        setChatDisplay(false);
        return;
      } else {
        setShowRequests(false);
        loadInboxProfiles();
        setChatDisplay(false);
      }
    }
  };

  const CheckRequestsClick = async () => {
    const auth = await userCheck();
    if (auth) {
      if (showRequests) {
        setChatDisplay(false);
        return;
      } else {
        setShowInbox(false);
        loadRequestsProfiles();
        setChatDisplay(false);
      }
    }
  };

  const loadInboxProfiles = async () => {
    setNoUsers(false);
    const profileCards = await Moralis.Cloud.run("loadInboxProfiles");
    if (profileCards !== "undefined") {
      setInboxUsers(profileCards);
      setShowInbox(true);
      setShowReply(true);
    }
    if (profileCards.length == 0) {
      setNoUsers(true);
    }
  };
  ///////////////////////////////////////////////////// profiles that have sent messages to!
  const loadRequestsProfiles = async () => {
    setNoUsers(false);
    setShowInbox(false);
    const profileCards = await Moralis.Cloud.run("loadRequestsProfiles");
    console.log(profileCards.length);
    if (profileCards !== "undefined") {
      setRequestsUsers(profileCards);
      setShowRequests(true);
      setShowReply(false);
    }
    if (profileCards.length == 0) {
      setNoUsers(true);
    }
  };

  const numberOfRequests = async () => {
    const numRequests = await Moralis.Cloud.run("loadNumRequests");
    console.log(numRequests);
    setNumRequests(numRequests);
    if (numRequests > 0) {
      setNotifyReq(true);
    } else {
      setNotifyReq(false);
    }
  };

  const loadRequestMessage = async (chatId, permission) => {
    setActiveChatId(0);
    const params = { chatId: chatId };
    const requestMessage = await Moralis.Cloud.run(
      "loadRequestMessage",
      params
    );
    setChatContent(requestMessage);
    setProcessRequest(permission);
    setChatDisplay(true);
    setActiveChatId(chatId);
  };

  const loadInboxMessage = async (chatId) => {
    //rename to load conversation and adjust to show all messages associated with conversation from new to old
    setActiveChatId(0);
    const params = { chatId: chatId };
    const requestMessage = await Moralis.Cloud.run("loadInboxMessage", params);
    setChatContent(requestMessage);
    await activateChatListener(chatId);
    setChatDisplay(true);
    setActiveChatId(chatId);
    setShowReply(true);
  };

  const activateChatListener = async (chatId) => {
    let query = new Moralis.Query("Messages");
    let subscription = await query.subscribe();
    subscription.on("create", async (object) => {
      const parent = object.get("parent");
      const parentId = parent.id;
      let objProfilePic = object.get("fromProfilePic");
      const objDate = object.get("date");
      const objMessage = object.get("message");
      const objTime = object.get("time");
      if (parentId == chatId) {
        setChatContent((prev) => [
          ...prev,
          {
            date: objDate,
            fromProfilePic: objProfilePic,
            time: objTime,
            message: objMessage,
          },
        ]);
      }
    });
  };

  const acceptRequest = async () => {
    try {
      const Conversation = Moralis.Object.extend("Conversation");
      const findConversation = new Moralis.Query(Conversation);
      findConversation.equalTo("objectId", activeChatId);
      const conversationFound = await findConversation.find();
      const conversation = conversationFound[0];
      conversation.set("requestAccepted", true);
      conversation.set("notifyUser2", false);
      await conversation.save();
      alert("Request accpeted! Conversation moved to inbox.");
      setChatDisplay(false);
      setShowRequests(false);
      await loadRequestsProfiles();
    } catch (error) {
      alert(error);
    }
  };

  const declineRequest = async () => {
    try {
      const Conversation = Moralis.Object.extend("Conversation");
      const findConversation = new Moralis.Query(Conversation);
      findConversation.equalTo("objectId", activeChatId);
      const conversationFound = await findConversation.find();
      const conversation = conversationFound[0];
      conversation.set("requestAccepted", false);
      conversation.set("notifyUser2", false);
      await conversation.save();
      alert("Request declined and removed.");
      setChatDisplay(false);
      setShowRequests(false);
      await loadRequestsProfiles();
    } catch (error) {
      alert(error);
    }
  };

  const sendReply = async () => {
    if (sendingMsg) {
      return;
    }
    if (reply == "") {
      return;
    }
    try {
      setSendingMsg(true);
      const Conversation = Moralis.Object.extend("Conversation");
      const findConversation = new Moralis.Query(Conversation);
      findConversation.equalTo("objectId", activeChatId);
      const conversationFound = await findConversation.find();
      const conversation = conversationFound[0];
      let toUser;
      if (conversation.attributes?.user1.id == user.id) {
        toUser = conversation.attributes?.user2.id;
      } else {
        toUser = conversation.attributes?.user1.id;
      }
      const msgDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const msgTime = new Date().toLocaleTimeString("en-US");
      const params = {
        from: user.attributes?.username,
        fromProfilePic: user.attributes?.profilePic?._url,
        to: toUser,
        date: msgDate,
        time: msgTime,
        message: reply,
        chatId: conversation.id,
      };
      const message = await Moralis.Cloud.run("sendReply", params);
      const relation = conversation.relation("messages");
      relation.add(message);
      await conversation.save();
      setReply("");
      setSendingMsg(false);
    } catch (error) {
      alert(error);
      setSendingMsg(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      numberOfRequests();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      numberOfRequests();
    }
  }, [isInitialized]);

  return (
    <div className="chat-background">
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-messaging-header-left">
            <button
              className="btn2 header-left-btn-msg"
              onClick={() => CheckInboxClick()}
            >
              <h5>Messages</h5>
            </button>
            <>
              <button
                className="btn2 header-left-btn-req"
                onClick={() => CheckRequestsClick()}
              >
                <span>
                  <h5>Requests</h5>
                </span>
                {notifyReq && (
                  <span className="numRequests">{numRequests}</span>
                )}
              </button>
            </>
          </div>
          <div className="chat-messaging-sidebar-content">
            {(showInbox || showRequests) && (
              <button
                id="mobile-chat-inbox-profiles"
                className="btn1"
                onClick={closeSidebarContent}
              >
                Close
              </button>
            )}
            {showInbox && (
              <ul className="chat-messaging-sidebar-from">
                {noUsers && (
                  <div
                    className="chat-messaging-header-left-empty"
                    onClick={() => setShowInbox(false)}
                  >
                    No Messages
                  </div>
                )}
                {inboxUsers.map((profile) => (
                  <div
                    key={profile.username}
                    className="chat-messaging-profiles"
                    onClick={() => loadInboxMessage(profile.chatId)}
                  >
                    <ProfileMessageCard
                      username={profile.username}
                      profilePic={profile.profilePic}
                      projectName={profile.projectName}
                      updatedAt={profile.date}
                      lastAction={profile.projectName}
                    />
                  </div>
                ))}
              </ul>
            )}
            {showRequests && (
              <ul className="chat-messaging-sidebar-from">
                {noUsers && (
                  <div
                    className="chat-messaging-header-left-empty "
                    onClick={() => setShowRequests(false)}
                  >
                    No Requests
                  </div>
                )}
                {requestsUsers.map((profile) => (
                  <div
                    key={profile.username}
                    className="chat-messaging-profiles"
                    onClick={() =>
                      loadRequestMessage(profile.chatId, profile.permission)
                    }
                  >
                    <ProfileMessageCard
                      username={profile.username}
                      profilePic={profile.profilePic}
                      projectName={profile.projectName}
                      updatedAt={profile.date}
                      lastAction={profile.projectName}
                    />
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="chat-messaging">
          <div className="chat-messaging-header-right">
            {/* <div className="show-chat-sidebar">
                            <button className="show-chat-sidebar-btn">SideBar</button>
                        </div> */}
            <h5>Welcome </h5>
            <div className="chat-messaging-welcome-user">
              <img
                className="chat-messaging-welcome-user-profilePic"
                src={user.attributes?.profilePic?._url}
              />
              <h5>{user.attributes?.username}</h5>
            </div>
          </div>
          <div className="chat-messaging-content-container">
            {chatDisplay && (
              <div className="chat-messaging-content-messageList">
                <div className="chat-messaging-content-message-wrapper">
                  <ScrollableFeed forceScroll={true}>
                    {chatContent.map((message) => (
                      <div
                        key={message.username}
                        className="chat-messaging-content-messageLoaded"
                      >
                        <div className="chat-messaging-content-message">
                          <div className="chat-messaging-content-profilePic-wrapper">
                            <img
                              className="chat-messaging-content-profilePic"
                              src={message.fromProfilePic}
                            />
                          </div>
                          <div className="chat-messaging-content-message-text">
                            <p>{ReactHtmlParser(message.message)}</p>
                            <div className="chat-messaging-content-message-time">
                              <p>
                                {message.date}, {message.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollableFeed>
                </div>
              </div>
            )}
            {/* <img id="chat-messaging-content-container-background" src={Background1} /> */}
          </div>
          <div className="chat-messaging-footer">
            {showReply && (
              <>
                {/* <input 
                                type="text" 
                                placeholder=" Reply..." 
                                className="chat-messaging-reply-text" 
                                id="chat-messaging-reply-text" 
                                value={reply} 
                                onChange={(event) =>setReply(event.currentTarget.value)} 
                                required
                                onKeyPress={(event) => { if(event.key === "Enter") {sendReply()}}}>

                            </input> */}
                <div className="rich-text-chat">
                  <CKEditor
                    editor={ClassicEditor}
                    onChange={handleReplyOnChange}
                  />
                </div>
                <div className="chat-messaging-reply-button">
                  <i class="fas fa-paper-plane" onClick={() => sendReply()}></i>
                </div>
                <div className="chat-messaging-trash-button">
                  <i class="fas fa-trash-alt" onClick={() => deletePopUp()}></i>
                </div>
              </>
            )}
            {showRequests && chatDisplay && (
              <div className="chat-messaging-footer-request-options">
                {!processRequest && (
                  <h6>Waiting for user to accept request.</h6>
                )}
                {processRequest && (
                  <>
                    <button className="btn2" onClick={() => acceptRequest()}>
                      Accept
                    </button>
                    <button className="btn3" onClick={() => declineRequest()}>
                      Decline
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {alertVisible && (
        <Alert visible={setAlertVisible} content={alertContents} />
      )}
    </div>
  );
}

export default ChatPage;
