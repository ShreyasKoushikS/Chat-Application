import styled from '@emotion/styled';

export const Container = styled.div`
  max-width: 1400px;
  height: 95vh;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    margin: 10px;
    height: 98vh;
    border-radius: 20px;
  }
`;

export const Header = styled.div`
  padding: 25px 40px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 300px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.show ? 'flex' : 'none'};
  }
`;

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
`;

export const Section = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    border-color: #4f46e5;
    outline: none;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    background: white;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  i {
    font-size: 18px;
  }
`;

export const RoomList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

export const RoomCard = styled.div`
  padding: 15px;
  background: ${props => props.isActive ? '#4f46e5' : 'white'};
  border-radius: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isActive ? '#4f46e5' : '#e2e8f0'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }

  h3 {
    margin: 0;
    color: ${props => props.isActive ? 'white' : '#1e293b'};
    font-size: 16px;
    font-weight: 500;
  }

  p {
    margin: 5px 0 0;
    color: ${props => props.isActive ? 'rgba(255,255,255,0.8)' : '#64748b'};
    font-size: 14px;
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

export const Message = styled.div`
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  
  .message-content {
    padding: 12px 18px;
    background: ${props => props.isUser ? 
      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 
      'white'};
    color: ${props => props.isUser ? 'white' : '#1e293b'};
    border-radius: 20px;
    border-bottom-${props => props.isUser ? 'right' : 'left'}-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: ${props => props.isUser ? 'none' : '1px solid #e2e8f0'};
  }

  .message-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    padding: 0 10px;
    font-size: 12px;
    color: #64748b;
  }
`;

export const SystemMessage = styled.div`
  text-align: center;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 20px;
  color: #64748b;
  font-size: 14px;
  margin: 10px 0;
  align-self: center;
`;

export const ChatInputContainer = styled.form`
  padding: 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
  position: relative;
`;

export const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  background: #f8fafc;
  padding: 5px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
`;

export const EmojiButton = styled.button`
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s ease;
  border-radius: 50%;

  &:hover {
    color: #4f46e5;
    background: #e2e8f0;
  }

  i {
    font-size: 20px;
  }
`;

export const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 20px;
  margin-bottom: 10px;
  z-index: 1000;

  .EmojiPickerReact {
    border: none !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
  }
`;

export const UserBadge = styled.div`
  background: #f8fafc;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;

  i {
    color: #22c55e;
  }
`;



export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

export const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.3);

  h3 {
    margin: 0 0 20px 0;
    color: #1e293b;
    font-size: 20px;
    font-weight: 600;
  }

  button {
    width: 100%;
    margin-top: 10px;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 20px;
  }
`;