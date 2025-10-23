/**
 * Componente de chat que permite interactuar con el contrato usando lenguaje natural
 */

import React, { useState, useRef, useEffect } from 'react';
import { useStacksContract } from '../hooks/useStacksContract';
import './ChatBot.css'; // Crearemos este archivo de estilos después

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: '¡Hola! Puedes preguntarme sobre el contador o pedirme que lo incremente.',
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    userAddress,
    isConnected,
    userBalance,
    chatResponse,
    isChatLoading,
    isTransactionPending,
    connectWallet,
    disconnectWallet,
    sendMessage
  } = useStacksContract();

  // Efecto para hacer scroll hacia abajo cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efecto para añadir la respuesta del chatbot cuando está disponible
  useEffect(() => {
    if (chatResponse !== null) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: chatResponse,
        sender: 'bot'
      }]);
    }
  }, [chatResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Añadir mensaje del usuario
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input,
      sender: 'user'
    }]);

    // Enviar mensaje al chatbot
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Chat con el Contrato</h2>
        {isConnected ? (
          <div className="wallet-info">
            <span>📬 {userAddress ? `${userAddress.substring(0, 5)}...${userAddress.substring(userAddress.length - 4)}` : ''}</span>
            <span>💰 {userBalance} STX</span>
            <button onClick={disconnectWallet} className="disconnect-btn">
              Desconectar
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="connect-btn">
            Conectar Wallet
          </button>
        )}
      </div>

      <div className="chatbot-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
        
        {isChatLoading && (
          <div className="message bot">
            <div className="message-content typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        
        {isTransactionPending && (
          <div className="transaction-pending">
            Procesando transacción...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected 
            ? "Escribe un mensaje, por ejemplo: '¿Cuánto vale el contador?'" 
            : "Conecta tu wallet para interactuar con el chatbot"}
          disabled={!isConnected || isChatLoading}
        />
        <button 
          type="submit" 
          disabled={!isConnected || isChatLoading || !input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatBot;