import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Messages() {
  const [chats, setChats] = useState([
    { username: 'john_doe', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', lastMsg: 'That\'s awesome! Let me know when it\'s live.' },
    { username: 'emma_watson', name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', lastMsg: 'Hi! Are you going to add css filters...' }
  ]);
  const [activeChat, setActiveChat] = useState('john_doe');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch messages from mock server
  useEffect(() => {
    axios.get('http://localhost:3000/messages')
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => {
        console.log("Failed to load messages from server, using local fallback:", err);
      });
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  const activeChatInfo = chats.find(c => c.username === activeChat) || chats[0];
  const activeChatMessages = messages.filter(m => m.chatId === activeChat);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: 'msg_' + Date.now(),
      chatId: activeChat,
      sender: 'pradhiksha040',
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    // Add locally immediately for speed
    setMessages(prev => [...prev, userMessage]);
    
    // Save last message text in left sidebar list
    setChats(prev => prev.map(c => {
      if (c.username === activeChat) {
        return { ...c, lastMsg: inputValue };
      }
      return c;
    }));

    setInputValue('');

    // POST to json-server to persist
    axios.post('http://localhost:3000/messages', userMessage)
      .catch(err => console.log("Failed to save message on server:", err));

    // Simulate friend response after 1 second
    setTimeout(() => {
      let responseText = "That sounds cool! Let's connect soon.";
      const cleanVal = inputValue.toLowerCase();
      
      if (cleanVal.includes('hello') || cleanVal.includes('hi') || cleanVal.includes('hey')) {
        responseText = `Hey! How is your Instagram Clone coming along? It looks really high-fidelity!`;
      } else if (cleanVal.includes('filter') || cleanVal.includes('css')) {
        responseText = `Yes! I noticed the CSS filters in the Create Post modal. The sepia and vintage effects look so retro! 📸`;
      } else if (cleanVal.includes('linkedin') || cleanVal.includes('post')) {
        responseText = `Make sure you tag me in your LinkedIn post. The dark mode theme is going to grab a lot of attention!`;
      } else if (cleanVal.includes('thanks') || cleanVal.includes('thank you')) {
        responseText = `You're very welcome! Keep up the brilliant work. 👍`;
      }

      const botMessage = {
        id: 'msg_' + (Date.now() + 1),
        chatId: activeChat,
        sender: activeChat,
        text: responseText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      
      setChats(prev => prev.map(c => {
        if (c.username === activeChat) {
          return { ...c, lastMsg: responseText };
        }
        return c;
      }));

      // POST chatbot message to server too
      axios.post('http://localhost:3000/messages', botMessage)
        .catch(err => console.log("Failed to save bot response on server:", err));

    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100" style={{ height: 'calc(100vh - 48px)' }}>
      <div className="messages-wrapper">
        
        {/* Chats Sidebar */}
        <div className="chats-sidebar">
          <div className="chats-header">
            <h4>pradhiksha040</h4>
            <i className="bi bi-pencil-square fs-5 cursor-pointer"></i>
          </div>
          <div className="chats-list">
            {chats.map(chat => (
              <div 
                key={chat.username}
                className={`chat-thread-row ${activeChat === chat.username ? 'active' : ''}`}
                onClick={() => setActiveChat(chat.username)}
              >
                <img src={chat.avatar} alt={chat.username} className="chat-thread-pic" />
                <div className="chat-thread-details">
                  <span className="chat-thread-username">{chat.username}</span>
                  <span className="chat-thread-lastmsg">{chat.lastMsg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {activeChatInfo ? (
            <>
              {/* Header */}
              <div className="chat-window-header">
                <img src={activeChatInfo.avatar} alt={activeChatInfo.username} className="chat-window-pic" />
                <div>
                  <div className="chat-window-username">{activeChatInfo.username}</div>
                  <small className="text-success fs-7">Active now</small>
                </div>
                <i className="bi bi-telephone fs-5 ms-auto me-3 cursor-pointer"></i>
                <i className="bi bi-camera-video fs-5 me-3 cursor-pointer"></i>
                <i className="bi bi-info-circle fs-5 cursor-pointer"></i>
              </div>

              {/* Messages area */}
              <div className="chat-window-messages">
                {activeChatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`message-bubble ${msg.sender === 'pradhiksha040' ? 'outgoing' : 'incoming'}`}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="chat-window-footer">
                <div className="chat-input-row">
                  <i className="bi bi-emoji-smile fs-5 me-2 cursor-pointer text-secondary"></i>
                  <input 
                    type="text" 
                    placeholder="Message..." 
                    className="chat-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  {inputValue.trim() && (
                    <button className="chat-send-btn" onClick={handleSendMessage}>Send</button>
                  )}
                  <i className="bi bi-image fs-5 ms-2 cursor-pointer text-secondary"></i>
                  <i className="bi bi-heart fs-5 ms-2 cursor-pointer text-secondary" onClick={() => {
                    setInputValue('❤️');
                    // Automatically trigger send after state updates
                  }}></i>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
              <i className="bi bi-chat-square-text-fill" style={{ fontSize: '64px' }}></i>
              <h5 className="mt-3">Your Messages</h5>
              <p>Send private photos and messages to a friend.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Messages;
