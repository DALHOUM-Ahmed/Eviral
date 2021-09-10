import React, { useState, useEffect} from 'react';
import { useMoralis } from 'react-moralis';
import { Link, useHistory } from 'react-router-dom';
import Alert from './Alert';
import './ChatPage.css';
import ProfileMessageCard from './ProfileMessageCard';


function ChatPage() {

    const { user, Moralis } = useMoralis();
    const [inboxUsers, setInboxUsers] = useState();
    const [requestsUsers, setRequestsUsers] = useState();
    const [ showInbox, setShowInbox] = useState(false);
    const [ showRequests, setShowRequests] = useState(false);
    const [chatContent, setChatContent] = useState();
    const [ chatDisplay, setChatDisplay] = useState(false);
    const [ activeChatId, setActiveChatId] = useState();
    const [ processRequest, setProcessRequet] = useState(false);
    const [ reply, setReply] = useState("");
    const [noUsers, setNoUsers] = useState(false);
    
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertContents, setAlertContents] = useState();

    const userCheck = async() => {
        const eViral = await Moralis.Web3.getERC20({tokenAddress: '0x7CeC018CEEF82339ee583Fd95446334f2685d24f'});
        const beViral = await Moralis.Web3.getERC20({chain:'bsc', tokenAddress: '0x7CeC018CEEF82339ee583Fd95446334f2685d24f'});
        const balanceETH = eViral.balance;
        const balanceBSC = beViral.balance;
        const hasProfile = user?.attributes?.profileCreated;
        if( (balanceETH < 100) && (balanceBSC < 100) ) {
            setAlertContents(
                <>
                <div className="alert-popup-contents">
                You'll need to own either eViral or beViral to access this feature.
                <Link to='/'><button className="btn2">Buy from Home Page</button></Link>
                </div>
                </>
                );
            setAlertVisible(true);
            return false;
        }  else
         if (!hasProfile) {
                setAlertContents(
                    <>
                <div className="alert-popup-contents">
                You'll need to set up a Profile to access this feature.
                <Link to='/myprofile'><button className="btn2">My Profile</button></Link>
                </div>
                </>
                ) 
                setAlertVisible(true);
                return false;
        } else {
            return true;
        }       
    }

    const init = 0;

    const CheckInboxClick = async() => {
        const auth = await userCheck();
        console.log(auth);
        console.log(showInbox);
        if(auth) {
            if(showInbox) {
                setChatDisplay(false);
                return;
            } else {
                setShowRequests(false);
                loadInboxProfiles();
                setChatDisplay(false);
                console.log("showInbox");
            }
        }
    }

    const CheckRequestsClick = async () => {
        const auth = await userCheck();
        if(auth) {
            if(showRequests) {
                setChatDisplay(false);
                return;
            } else {
                setShowInbox(false);
                loadRequestsProfiles();
                setChatDisplay(false);
                console.log("showRequests");
            }
        }
    }

    const loadInboxProfiles = async() => {
        setNoUsers(false);
        const profileCards = await Moralis.Cloud.run("loadInboxProfiles");
        if(profileCards !== 'undefined') {
        setInboxUsers(profileCards);
        setShowInbox(true);
        }
        console.log(profileCards);
        if(profileCards.length == 0) {
            setNoUsers(true);
        }
    }
    ///////////////////////////////////////////////////// profiles that have sent messages to!
    const loadRequestsProfiles = async() => { 
        setNoUsers(false);       
        const profileCards = await Moralis.Cloud.run("loadRequestsProfiles");
        if(profileCards !== 'undefined') {
        setRequestsUsers(profileCards);
        setShowRequests(true);
        }
        console.log(profileCards);
        if(profileCards.length == 0) {
            setNoUsers(true);
        }
    }

    const loadRequestMessage = async(chatId, permission) => {
        setActiveChatId(0);
        const params = { chatId: chatId};
        const requestMessage =  await Moralis.Cloud.run("loadRequestMessage", params);
        setChatContent(requestMessage);
        console.log(requestMessage);
        setProcessRequet(permission);
        setChatDisplay(true);
        setActiveChatId(chatId);
    }

    const loadInboxMessage = async(chatId) => {  //rename to load conversation and adjust to show all messages associated with conversation from new to old
        setActiveChatId(0);   
        const params = { chatId: chatId};
        const requestMessage =  await Moralis.Cloud.run("loadInboxMessage", params);
        setChatContent(requestMessage);        
        // await activateChatListener(chatId);
        setChatDisplay(true);
        setActiveChatId(chatId);
    }

    // const activateChatListener = async(chatId) => {        
        
    //     let query = new Moralis.Query('Messages');
    //     let subscription = await query.subscribe();
    //     subscription.on('create', (object) => {
    //         if(object.get('parent.id') == chatId){
    //             loadInboxMessage(activeChatId);
    //         }
    //     });
    // }

    const acceptRequest = async() => {
        try{
        const Conversation = Moralis.Object.extend('Conversation');
        const findConversation = new Moralis.Query(Conversation);
        findConversation.equalTo('objectId', activeChatId)
        const conversationFound = await findConversation.find();
        const conversation = conversationFound[0];
        conversation.set('requestAccepted', true);
        conversation.set('notifyUser2', false);
        await conversation.save();
        alert("Request accpeted! Conversation moved to inbox.");
        setChatDisplay(false);
        setShowRequests(false);
        await loadRequestsProfiles();
        } catch (error) {
            alert(error)
        } 
    }

    const declineRequest = async() => {
        try{
        const Conversation = Moralis.Object.extend('Conversation');
        const findConversation = new Moralis.Query(Conversation);
        findConversation.equalTo('objectId', activeChatId)
        const conversationFound = await findConversation.find();
        const conversation = conversationFound[0];
        conversation.set('requestAccepted', false);
        conversation.set('notifyUser2', false);
        await conversation.save();
        alert("Request declined and removed."); 
        setChatDisplay(false);
        setShowRequests(false);
        await loadRequestsProfiles(); 
        } catch (error) {
            alert(error)
        } 
    }

    const sendReply = async() => {
        try{
            const Conversation = Moralis.Object.extend('Conversation');
            const findConversation = new Moralis.Query(Conversation);
            findConversation.equalTo('objectId', activeChatId)
            const conversationFound = await findConversation.find();
            const conversation = conversationFound[0];
            console.log(conversation.attributes?.user2.attributes?.username);
            
            let toUser;
            if (conversation.attributes?.user1.id == user.id) {
                toUser = conversation.attributes?.user2.id;
            } else {
                toUser = conversation.attributes?.user1.id;
            }
            console.log(toUser);
            const msgDate = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
            const msgTime = new Date().toLocaleTimeString('en-US');
            const params = { from: user.attributes?.username, to: toUser, date: msgDate, time: msgTime, message: reply, chatId: conversation.id};        
            const message = await Moralis.Cloud.run("sendReply", params);        
            
            const relation = conversation.relation("messages");
            relation.add(message);
            await conversation.save();   
            setReply("");   
            
             } catch (error) {
                 alert(error)
             } 
    }

    useEffect(() => {
        
    }, [init])
    

    return (
        <div className="chat-background">
            <div className="chat-container">
                <div className="chat-sidebar">
                    <div className="chat-messaging-header-left">                       
                        <button className="btn2 header-left-btn-msg" onClick={() => CheckInboxClick()}><h5>Messages</h5></button>
                        <button className="btn2 header-left-btn-req"onClick={() => CheckRequestsClick()}><h5>Requests</h5></button>
                    </div>
                    <div className="chat-messaging-sidebar-content">
                        { showInbox &&
                        <ul className="chat-messaging-sidebar-from">
                            {noUsers && <div className="chat-messaging-header-left">Empty</div>}
                            {inboxUsers.map(profile => (                          
                            <div key={profile.username} className="chat-messaging-profiles" onClick={() => loadInboxMessage(profile.chatId)}>                                                   
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
                        }
                        { showRequests &&
                        <ul className="chat-messaging-sidebar-from">
                        {noUsers && <div className="chat-messaging-header-left">Empty</div>}
                        {requestsUsers.map(profile => (                          
                          <div key={profile.username} className="chat-messaging-profiles" onClick={() => loadRequestMessage(profile.chatId, profile.permission)}>                                                   
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
                        }
                    </div>
                </div>
                <div className="chat-messaging">   
                    <div className="chat-messaging-header-right">
                        <h5>Welcome </h5>
                            <div className="chat-messaging-welcome-user">
                                <img className="chat-messaging-welcome-user-profilePic" src={user.attributes?.profilePic?._url} />
                                <h5>{user.attributes?.username}</h5>
                            </div>
                    </div>
                    <div className="chat-messaging-content-container">
                            { chatDisplay && 
                                <div className="chat-messaging-content-messageList">                                                               
                                    <div className="chat-messaging-content-message-wrapper">
                                        {chatContent.map(message => (
                                        <div key={message.username} className="chat-messaging-content-messageLoaded">
                                                {/* <p>{message.projectName}</p> */}
                                                <div className="chat-messaging-content-message">
                                                    <div className="chat-messaging-content-profilePic-wrapper">
                                                        <img className="chat-messaging-content-profilePic" src={message.fromProfilePic} />
                                                    </div>
                                                    <div className="chat-messaging-content-message-text">
                                                        <p>{message.message}</p>
                                                    </div>
                                                </div>
                                                <div className="chat-messaging-content-message-time">
                                                    <p>{message.date}, {message.time}</p>
                                                </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            }   
                        
                    </div>
                    <div className="chat-messaging-footer">
                        {showInbox &&
                        <>
                            <input 
                                type="text" 
                                placeholder=" Reply..." 
                                className="chat-messaging-reply-text" 
                                value={reply} 
                                onChange={(event) =>setReply(event.currentTarget.value)} 
                                onKeyPress={(event) => { if(event.key === "Enter") {sendReply()}}}>

                            </input>
                            <div className="chat-messaging-reply-button">
                                <i class="fas fa-paper-plane" onClick={() => sendReply()}></i>
                            </div>
                        </>
                        }
                        { (showRequests && chatDisplay) &&
                        <div className="chat-messaging-footer-request-options">
                            {!processRequest &&
                            <h6>Waiting for user to accept request.</h6>
                            }
                            {processRequest &&
                            <>
                            <button className="btn2" onClick={()=> acceptRequest()}>Accept</button>
                            <button className="btn3" onClick={()=> declineRequest()}>Decline</button>
                            </>
                            }
                        </div>
                        }
                    </div>

                </div>
            </div>

            {alertVisible &&
            <Alert 
            visible={setAlertVisible}
            content={alertContents}            
            />
            }
        </div>
    )
}

export default ChatPage;