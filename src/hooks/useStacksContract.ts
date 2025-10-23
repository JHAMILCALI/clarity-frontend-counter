/**
 * Custom Hook para la conexión de wallet, chatbot y contrato inteligente
 */

import { useState, useCallback } from 'react';
import { connect, showContractCall } from '@stacks/connect';
import { 
  PostConditionMode 
} from '@stacks/transactions';
import {
  NETWORK,
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  CONTRACT_FUNCTIONS,
} from '../config/contract';
import { sendChatMessage, getCounterValue } from '../services/chatService';

// Tipos TypeScript
interface UseStacksContractReturn {
  // Estado de la wallet
  userAddress: string | null;
  isConnected: boolean;
  
  // Balance del usuario
  userBalance: string | null;
  
  // Estado del contador
  count: number | null;
  isLoadingCount: boolean;
  
  // Estado del chatbot
  chatResponse: string | null;
  isChatLoading: boolean;
  
  // Estado de transacciones
  isTransactionPending: boolean;
  transactionId: string | null;
  
  // Funciones
  connectWallet: () => void;
  disconnectWallet: () => void;
  incrementCounter: () => Promise<void>;
  getCount: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
}

/**
 * Hook para conectar la wallet, chatbot y contrato inteligente
 */
export const useStacksContract = (): UseStacksContractReturn => {
  // Estados de la wallet
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState<string | null>(null);
  
  // Estados del contador
  const [count, setCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  
  // Estados del chatbot
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Estados de transacciones
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  /**
   * Obtiene el balance del usuario
   */
  const fetchUserBalance = async (address: string) => {
    try {
      const response = await fetch(`${NETWORK.client.baseUrl}/v2/accounts/${address}?proof=0`);
      const data = await response.json();
      const balance = (parseInt(data.balance) / 1000000).toFixed(6); // Convertir de microSTX a STX
      setUserBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  /**
   * Conecta la wallet del usuario
   */
  const connectWallet = async () => {
    try {
      const result = await connect();
      if (result && result.addresses) {
        const stxAddress = result.addresses.find((addr: any) => addr.symbol === 'STX' || addr.address.startsWith('S'));
        if (stxAddress) {
          setUserAddress(stxAddress.address);
          setIsConnected(true);
          fetchUserBalance(stxAddress.address);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  /**
   * Desconecta la wallet del usuario
   */
  const disconnectWallet = () => {
    setUserAddress(null);
    setIsConnected(false);
    setUserBalance(null);
  };

  /**
   * Obtiene el valor actual del contador
   */
  const getCount = async () => {
    setIsLoadingCount(true);
    try {
      const value = await getCounterValue();
      setCount(value);
      // Asegurar que se muestre como número entero
      setChatResponse(`El contador actual es: ${value}`);
    } catch (error) {
      console.error('Error al obtener el contador:', error);
      setChatResponse('Error al obtener el valor del contador');
    } finally {
      setIsLoadingCount(false);
    }
  };

  /**
   * Incrementa el contador (requiere transacción)
   */
  const incrementCounter = async () => {
    if (!isConnected || !userAddress) {
      setChatResponse('Debes conectar tu wallet primero');
      return;
    }

    setIsTransactionPending(true);
    setChatResponse('Debes aprobar la transacción desde tu wallet...');

    try {
      showContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: CONTRACT_FUNCTIONS.INCREMENT,
        functionArgs: [],
        network: NETWORK.chainId === 2147483648 ? 'testnet' : 'mainnet',
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: (data: any) => {
          console.log('Transaction submitted:', data.txId);
          setTransactionId(data.txId);
          setIsTransactionPending(false);
          setChatResponse('¡Transacción enviada! El contador se actualizará pronto.');
          
          // Actualizar el contador después de unos segundos
          setTimeout(() => {
            getCount();
          }, 5000);
        },
        onCancel: () => {
          console.log('Transaction cancelled');
          setIsTransactionPending(false);
          setChatResponse('Transacción cancelada por el usuario');
        },
      });
    } catch (error: any) {
      console.error('Error calling contract:', error);
      setChatResponse(`Error al ejecutar la transacción: ${error.message || 'Error desconocido'}`);
      setIsTransactionPending(false);
    }
  };

  /**
   * Envía un mensaje al chatbot y procesa la acción recomendada
   */
  const sendMessage = async (message: string) => {
    setIsChatLoading(true);
    setChatResponse(null);
    
    try {
      const response = await sendChatMessage(message);
      
      // Procesar la acción recomendada por el chatbot
      switch (response.action) {
        case 'read':
          await getCount();
          break;
        case 'increment':
          await incrementCounter();
          break;
        default:
          setChatResponse(response.message);
      }
    } catch (error) {
      console.error('Error en el chatbot:', error);
      setChatResponse('Error al procesar tu mensaje');
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    // Wallet
    userAddress,
    isConnected,
    
    // Balance
    userBalance,
    
    // Contador
    count,
    isLoadingCount,
    
    // Chatbot
    chatResponse,
    isChatLoading,
    
    // Transacciones
    isTransactionPending,
    transactionId,
    
    // Funciones
    connectWallet,
    disconnectWallet,
    incrementCounter,
    getCount,
    sendMessage,
  };
};
