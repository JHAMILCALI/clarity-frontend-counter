/**
 * Custom Hook para la conexión de wallet, chatbot y contrato inteligente
 */

import { useState, useCallback } from 'react';
import { connect, showContractCall } from '@stacks/connect';
import { 
  PostConditionMode,
  principalCV,
  uintCV
} from '@stacks/transactions';
import {
  NETWORK,
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  CONTRACT_FUNCTIONS,
} from '../config/contract';
import { sendChatMessage, getCounterValue, prepareTransfer, getWalletBalance, checkTransaction } from '../services/chatService';

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
  
  // Estado de confirmación de transferencia
  pendingTransfer: {
    recipient: string;
    amount: number;
    message: string;
  } | null;
  
  // Funciones
  connectWallet: () => void;
  disconnectWallet: () => void;
  incrementCounter: () => Promise<void>;
  getCount: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  confirmTransfer: () => Promise<void>;
  cancelTransfer: () => void;
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
  
  // Estado de confirmación de transferencia
  const [pendingTransfer, setPendingTransfer] = useState<{
    recipient: string;
    amount: number;
    message: string;
  } | null>(null);
  
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
        case 'transfer':
          // Si la acción es transferir, mostrar confirmación
          if (response.recipient && response.amount) {
            setPendingTransfer({
              recipient: response.recipient,
              amount: response.amount,
              message: `¿Deseas transferir ${response.amount} STX a ${response.recipient}?`
            });
            setChatResponse(`✋ Confirma la transferencia de ${response.amount} STX a ${response.recipient}`);
          } else {
            setChatResponse('⚠️ No pude identificar el destinatario o la cantidad. Por favor, especifica la dirección y el monto.');
          }
          break;
        case 'balance':
          // Consultar balance
          if (response.address) {
            try {
              const balanceData = await getWalletBalance(response.address);
              setChatResponse(balanceData.message);
            } catch (error) {
              setChatResponse('Error al consultar el balance');
            }
          } else {
            setChatResponse('⚠️ Por favor, especifica una dirección válida para consultar el balance.');
          }
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

  /**
   * Confirma y ejecuta la transferencia pendiente
   */
  const confirmTransfer = async () => {
    if (!pendingTransfer || !userAddress || !isConnected) {
      setChatResponse('⚠️ Debes conectar tu wallet primero');
      return;
    }

    setIsTransactionPending(true);
    setChatResponse('⏳ Preparando transferencia...');

    try {
      // Preparar la transferencia con el backend
      const transferData = await prepareTransfer(
        userAddress,
        pendingTransfer.recipient,
        pendingTransfer.amount
      );

      // Convertir el monto a microSTX
      const amountInMicroSTX = Math.floor(pendingTransfer.amount * 1000000);

      // Ejecutar la transferencia usando el contrato
      showContractCall({
        contractAddress: transferData.contract_address,
        contractName: transferData.contract_name,
        functionName: transferData.function_name,
        functionArgs: [
          principalCV(pendingTransfer.recipient),
          uintCV(amountInMicroSTX)
        ],
        network: NETWORK.chainId === 2147483648 ? 'testnet' : 'mainnet',
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: async (data: any) => {
          console.log('Transfer transaction submitted:', data.txId);
          setTransactionId(data.txId);
          setIsTransactionPending(false);
          setPendingTransfer(null);
          
          // Verificar el estado de la transacción
          try {
            const txStatus = await checkTransaction(data.txId);
            setChatResponse(
              `✅ ${txStatus.message}\n\n` +
              `📋 ID de transacción: ${data.txId}\n\n` +
              `🔗 Ver en explorer: ${txStatus.explorer_url}`
            );
          } catch (error) {
            setChatResponse(
              `✅ Transferencia enviada exitosamente!\n\n` +
              `📋 ID de transacción: ${data.txId}\n\n` +
              `🔗 Ver en explorer: https://explorer.hiro.so/txid/${data.txId}?chain=testnet`
            );
          }
          
          // Actualizar el balance después de unos segundos
          setTimeout(() => {
            if (userAddress) {
              fetchUserBalance(userAddress);
            }
          }, 5000);
        },
        onCancel: () => {
          console.log('Transaction cancelled');
          setIsTransactionPending(false);
          setPendingTransfer(null);
          setChatResponse('❌ Transferencia cancelada por el usuario');
        },
      });
    } catch (error: any) {
      console.error('Error transferring STX:', error);
      setChatResponse(`❌ Error al realizar la transferencia: ${error.message || 'Error desconocido'}`);
      setIsTransactionPending(false);
      setPendingTransfer(null);
    }
  };

  /**
   * Cancela la transferencia pendiente
   */
  const cancelTransfer = () => {
    setPendingTransfer(null);
    setChatResponse('❌ Transferencia cancelada');
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
    
    // Transferencias
    pendingTransfer,
    
    // Transacciones
    isTransactionPending,
    transactionId,
    
    // Funciones
    connectWallet,
    disconnectWallet,
    incrementCounter,
    getCount,
    sendMessage,
    confirmTransfer,
    cancelTransfer,
  };
};
