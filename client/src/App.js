import React, { useState, useEffect } from 'react';
import { MobileOverlay, BackButton } from './styles/StyledComponents';
import io from 'socket.io-client';
import { 
  Container, 
  Header, 
  MainContent,
  UserBadge,
  ChatArea,
  ToggleButton
} from './styles/StyledComponents';
import Login from './components/Login';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import PasswordModal from './components/PasswordModal';

// Connect to the server
const socket = io(process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:4000',
  {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
);

function App() {
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState('login');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isMobile] = useState(window.innerWidth <= 768);


  useEffect(() => {
    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Chat events
    socket.on('roomList', (roomList) => {
      setRooms(roomList);
    });

    socket.on('message', (data) => {
      setMessages(prev => [...prev, { ...data, type: 'message' }]);
    });

    socket.on('systemMessage', (message) => {
      setMessages(prev => [...prev, { type: 'system', content: message }]);
    });

    socket.on('previousMessages', (prevMessages) => {
      setMessages(prevMessages || []);
    });

    socket.on('joinSuccess', (roomName) => {
      setCurrentRoom(roomName);
      setView('chat');
      // On mobile, hide sidebar after joining room
      if (window.innerWidth <= 768) {
        setShowSidebar(false);
      }
    });

    socket.on('passwordRequired', () => {
      setShowPasswordModal(true);
    });

    socket.on('error', (message) => {
      alert(message);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('roomList');
      socket.off('message');
      socket.off('systemMessage');
      socket.off('previousMessages');
      socket.off('joinSuccess');
      socket.off('passwordRequired');
      socket.off('error');
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit('login', username);
      setView('rooms');
      socket.emit('getRoomList');
    }
  };

  const handleCreateRoom = (roomName, password) => {
    socket.emit('createRoom', { roomName, password });
  };

  const handleJoinRoom = (roomName, password = '') => {
    setSelectedRoom(roomName);
    socket.emit('joinRoom', { room: roomName, username, password });
  };

  const handleSendMessage = () => {
    if (message.trim() && currentRoom) {
      socket.emit('chatMessage', { message });
      setMessage('');
    }
  };

  const handlePasswordSubmit = (password) => {
    handleJoinRoom(selectedRoom, password);
    setShowPasswordModal(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'login':
        return 'Welcome to Chat';
      case 'rooms':
        return 'Select a Room';
      case 'chat':
        return `Room: ${currentRoom}`;
      default:
        return 'Chat App';
    }
  };

  return (
    <Container>
      <Header>
        {view === 'chat' && isMobile && (
          <BackButton onClick={() => setShowSidebar(true)}>
            <i className="fas fa-arrow-left"></i>
          </BackButton>
        )}
        <h1>{getHeaderTitle()}</h1>
        {username && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserBadge>
              <i className={`fas fa-circle ${isConnected ? 'connected' : ''}`}></i>
              {username}
            </UserBadge>
            {view === 'chat' && isMobile && (
              <ToggleButton onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
              </ToggleButton>
            )}
          </div>
        )}
      </Header>
  
      <MainContent>
        {view === 'login' && (
          <Login 
            username={username}
            setUsername={setUsername}
            onLogin={handleLogin}
          />
        )}
  
        {view !== 'login' && (
          <>
            <MobileOverlay show={showSidebar} onClick={() => setShowSidebar(false)} />
            <Sidebar show={showSidebar}>
              <RoomList 
                rooms={rooms}
                currentRoom={currentRoom}
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
              />
            </Sidebar>
            
            {view === 'chat' && (
              <ChatArea>
                <ChatRoom 
                  messages={messages}
                  currentUser={username}
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSendMessage}
                />
              </ChatArea>
            )}
          </>
        )}
      </MainContent>
  
      {showPasswordModal && (
        <PasswordModal 
          onSubmit={handlePasswordSubmit}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </Container>
  );
}

export default App;