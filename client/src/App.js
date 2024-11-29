import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { 
  Container, 
  Header, 
  MainContent,
  UserBadge 
} from './styles/StyledComponents';
import Login from './components/Login';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import PasswordModal from './components/PasswordModal';

const socket = io(window.location.origin, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

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

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

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
    });

    socket.on('passwordRequired', () => {
      setShowPasswordModal(true);
    });

    socket.on('error', (message) => {
      alert(message);
    });

    return () => {
      socket.off('connect');
      socket.off('roomList');
      socket.off('message');
      socket.off('systemMessage');
      socket.off('previousMessages');
      socket.off('joinSuccess');
      socket.off('passwordRequired');
      socket.off('error');
    };
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

  return (
    <Container>
      <Header>
        <h1>
          {view === 'login' ? 'Welcome to Chat' : 
           view === 'rooms' ? 'Select a Room' : 
           `Room: ${currentRoom}`}
        </h1>
        {username && (
          <UserBadge>
            <i className="fas fa-circle"></i>
            {username}
          </UserBadge>
        )}
        {view === 'chat' && (
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'block',
              padding: '5px'
            }}
          >
            <i className={`fas fa-${showSidebar ? 'times' : 'bars'}`}></i>
          </button>
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
            {showSidebar && (
              <RoomList 
                rooms={rooms}
                currentRoom={currentRoom}
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
              />
            )}
            
            {view === 'chat' && (
              <ChatRoom 
                messages={messages}
                currentUser={username}
                message={message}
                setMessage={setMessage}
                onSendMessage={handleSendMessage}
              />
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