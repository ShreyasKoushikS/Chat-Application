import React, { useState } from 'react';
import { 
  Modal, 
  Backdrop, 
  Input, 
  Button 
} from '../styles/StyledComponents';

const PasswordModal = ({ onSubmit, onClose }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(password);
    setPassword('');
  };

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Enter Room Password</h3>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button 
          onClick={handleSubmit}
          style={{ marginTop: '15px' }}
        >
          <i className="fas fa-lock-open"></i>
          Join Room
        </Button>
        <Button 
          onClick={onClose}
          style={{ 
            marginTop: '10px',
            background: '#ef4444'
          }}
        >
          <i className="fas fa-times"></i>
          Cancel
        </Button>
      </Modal>
    </>
  );
};

export default PasswordModal;