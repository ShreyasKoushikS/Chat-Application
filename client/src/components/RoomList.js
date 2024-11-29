import React, { useState } from 'react';
import { 
  Sidebar,
  RoomList as StyledRoomList,
  RoomCard,
  Input,
  Button
} from '../styles/StyledComponents';

const RoomList = ({ rooms, currentRoom, onCreateRoom, onJoinRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName, newRoomPassword);
      setNewRoomName('');
      setNewRoomPassword('');
    }
  };

  return (
    <Sidebar>
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '15px', color: '#1e293b' }}>Chat Rooms</h2>
        <Input
          type="text"
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Room password (optional)"
          value={newRoomPassword}
          onChange={(e) => setNewRoomPassword(e.target.value)}
          style={{ marginTop: '10px' }}
        />
        <Button 
          onClick={handleCreateRoom}
          disabled={!newRoomName.trim()}
          style={{ marginTop: '10px', width: '100%' }}
        >
          <i className="fas fa-plus"></i>
          Create Room
        </Button>
      </div>

      <StyledRoomList>
        {rooms.map((room, index) => (
          <RoomCard
            key={index}
            isActive={room.name === currentRoom}
            onClick={() => onJoinRoom(room.name)}
          >
            <h3>
              {room.name}
              {room.isProtected && <i className="fas fa-lock" style={{ marginLeft: '8px', fontSize: '14px' }}></i>}
            </h3>
            <p>{room.userCount} users online</p>
          </RoomCard>
        ))}
      </StyledRoomList>
    </Sidebar>
  );
};

export default RoomList;