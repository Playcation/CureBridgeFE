import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Button, Container, Paper, TextField, Typography} from '@mui/material';
import axios from 'axios';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const {roomId} = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const API_BASE_URL = '/chat';
  const stompClient = useRef<Client | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 1. 내 정보 추출 (토큰에서 이메일을 추출하거나 LocalStorage에서 가져옴)
  const getAuthData = () => {
    try {
      const persistRoot = localStorage.getItem("persist:root");
      if (!persistRoot) return {token: null, email: ""};

      const rootData = JSON.parse(persistRoot);
      const authData = JSON.parse(rootData.auth);

      // JWT 토큰 내부에 sub 필드 등에 이메일이 들어있을 확률이 높습니다.
      // 만약 authData에 직접 email이 없다면 토큰 디코딩 로직이 필요할 수 있습니다.
      return {
        token: authData.token || null,
        email: (authData.email || "testemail@gamil.com").toLowerCase().trim() // 임시로 확인된 이메일 사용
      };
    } catch (e) {
      return {token: null, email: ""};
    }
  };

  useEffect(() => {
    const {token} = getAuthData();
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/history/${roomId}`, {
          headers: {'Authorization': `Bearer ${token}`}
        });
        setMessages(response.data);
      } catch (error) {
        console.error("이력 로드 실패:", error);
      }
    };
    fetchHistory();
    connect();
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
      }
    };
  }, [roomId]);

  const connect = () => {
    const {token} = getAuthData();
    if (!token || stompClient.current?.active) return;
    const client = new Client({
      webSocketFactory: () => new SockJS("/connect"),
      connectHeaders: {Authorization: `Bearer ${token}`},
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe(`/topic/${roomId}`, (message) => {
        const parsed = JSON.parse(message.body);
        setMessages((prev) => [...prev, parsed]);
      });
    };
    client.onDisconnect = () => setIsConnected(false);
    stompClient.current = client;
    client.activate();
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected || !stompClient.current?.connected) return;

    const {email} = getAuthData();
    const payload = {
      senderEmail: email, // 💡 이메일을 실어서 보냄
      message: newMessage,
      roomId: Number(roomId)
    };

    stompClient.current.publish({
      destination: `/publish/${roomId}`,
      body: JSON.stringify(payload),
    });
    setNewMessage("");
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
      <Container maxWidth="sm" sx={{mt: 4}}>
        <Paper elevation={3} sx={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          borderRadius: 3
        }}>
          <Typography variant="h6" sx={{textAlign: 'center', mb: 2, fontWeight: 'bold'}}>
            채팅방 #{roomId} {isConnected ? "🟢" : "🔴"}
          </Typography>

          <Box ref={chatBoxRef} sx={{
            flexGrow: 1,
            overflowY: 'auto',
            mb: 2,
            bgcolor: '#f0f2f5',
            p: 2,
            borderRadius: 2
          }}>
            {messages.map((msg, i) => {
              const {email: myEmail} = getAuthData();

              // 💡 [이메일 기반 판별 로직]
              // 양쪽 모두 소문자로 변환하고 공백을 제거한 뒤 비교합니다.
              const isMe = msg.senderEmail && myEmail &&
                  msg.senderEmail.toLowerCase().trim() === myEmail.toLowerCase().trim();

              return (
                  <Box key={i} sx={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    mb: 1.5
                  }}>
                    <Box sx={{maxWidth: '75%'}}>
                      {!isMe && (
                          <Typography variant="caption"
                                      sx={{ml: 0.5, color: '#65676b', display: 'block', mb: 0.3}}>
                            {msg.senderEmail || "상대방"}
                          </Typography>
                      )}
                      <Box sx={{
                        p: 1.5,
                        borderRadius: isMe ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                        bgcolor: isMe ? '#0084ff' : '#fff',
                        color: isMe ? '#fff' : '#000',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        <Typography variant="body2">{msg.message}</Typography>
                      </Box>
                    </Box>
                  </Box>
              );
            })}
          </Box>

          <Box sx={{display: 'flex', gap: 1}}>
            <TextField
                fullWidth
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isConnected ? "메시지 입력..." : "연결 대기 중..."}
            />
            <Button variant="contained" onClick={sendMessage} disabled={!isConnected}>전송</Button>
          </Box>
        </Paper>
      </Container>
  );
};

export default ChatPage;