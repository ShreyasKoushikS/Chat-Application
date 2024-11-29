import React from 'react';
import { Section, Input, Button } from '../styles/StyledComponents';

const Login = ({ username, setUsername, onLogin }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username.trim()) {
      onLogin();
    }
  };

  return (
    <Section>
      <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Welcome to Chat App</h2>
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          onClick={onLogin} 
          disabled={!username.trim()}
          style={{ marginTop: '10px' }}
        >
          <i className="fas fa-sign-in-alt"></i>
          Join Chat
        </Button>
      </div>
    </Section>
  );
};

export default Login;