import React, { useState } from 'react';
import { 
  Section, 
  Input, 
  Button, 
  RoomList, 
  RoomCard,
  FlexContainer 
} from '../styles/StyledComponents';

const RoomDirectory = ({ rooms, onCreateRoom, onJoinRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName, password);
      setNewRoomName('');
      setPassword('');
    }
  };

  return (
    <Section>
      <div>
        <Input
          type="text"
          placeholder="Room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth onClick={handleCreateRoom}>Create Room</Button>
      </div>

      <RoomList>
        {rooms.map((room, index) => (
          <RoomCard
            key={index}
            isProtected={room.isProtected}
            onClick={() => onJoinRoom(room.name)}
          >
            <FlexContainer>
              <div>{room.name}</div>
              <div>{room.userCount} users</div>
            </FlexContainer>
          </RoomCard>
        ))}
      </RoomList>
    </Section>
  );
};

export default RoomDirectory;