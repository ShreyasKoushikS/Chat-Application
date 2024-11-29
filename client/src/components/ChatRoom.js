import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import {
  ChatArea,
  MessagesContainer,
  Message,
  SystemMessage,
  ChatInputContainer,
  InputWrapper,
  Input,
  EmojiButton,
  EmojiPickerContainer,
  Button
} from '../styles/StyledComponents';

const ChatRoom = ({ messages, currentUser, message, setMessage, onSendMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage();
      setShowEmojiPicker(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ChatArea>
      <MessagesContainer>
        {messages.map((msg, index) => (
          msg.type === 'system' ? (
            <SystemMessage key={index}>
              {msg.content}
            </SystemMessage>
          ) : (
            <Message key={index} isUser={msg.username === currentUser}>
              <div className="message-content">
                <strong>{msg.username !== currentUser && msg.username}</strong>
                <div>{msg.content || msg.message}</div>
              </div>
              <div className="message-meta">
                <span>{formatTime(msg.timestamp)}</span>
              </div>
            </Message>
          )
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <ChatInputContainer onSubmit={handleSubmit}>
        <InputWrapper>
          <EmojiButton
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <i className="far fa-smile"></i>
          </EmojiButton>
          
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ border: 'none', background: 'transparent' }}
          />
          
          <Button
            type="submit"
            disabled={!message.trim()}
            style={{ padding: '10px 20px', borderRadius: '15px' }}
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </InputWrapper>

        {showEmojiPicker && (
          <EmojiPickerContainer ref={emojiPickerRef}>
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width={350}
              height={400}
            />
          </EmojiPickerContainer>
        )}
      </ChatInputContainer>
    </ChatArea>
  );
};

export default ChatRoom;