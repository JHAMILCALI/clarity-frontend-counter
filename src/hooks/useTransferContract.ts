/**
 * Custom Hook para el contrato de transferencia de STX (versión simplificada)
 * Permite a cualquier usuario transferir STX a otra wallet
 */

import { useState } from 'react';
import { connect, showContractCall } from '@stacks/connect';
import { 
  PostConditionMode,
  uintCV,
  principalCV,
} from '@stacks/transactions';
import {
  NETWORK,
  TRANSFER_CONTRACT_ADDRESS,
  TRANSFER_CONTRACT_NAME,
  TRANSFER_CONTRACT_FUNCTIONS,
} from '../config/transferContract';

// Tipos TypeScript
interface UseTransferContractReturn {
  // Estado de la wallet
  userAddress: string | null;
  isConnected: boolean;
  userBalance: string | null;
  
  // Estado de transacciones
  isTransactionPending: boolean;
  transactionId: string | null;
  transactionError: string | null;
  transactionSuccess: string | null;
  
  // Funciones
  connectWallet: () => void;
  disconnectWallet: () => void;
  transferSTX: (recipient: string, amount: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

/**
 * Hook para interactuar con el contrato de transferencia
 */
export const useTransferContract = (): UseTransferContractReturn => {
  // Estados de la wallet
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState<string | null>(null);
  
  // Estados de transacciones
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(null);

  /**
   * Obtiene el balance del usuario
   */
  const fetchUserBalance = async (address: string) => {
    try {
      const response = await fetch(`${NETWORK.client.baseUrl}/v2/accounts/${address}?proof=0`);
      const data = await response.json();
      const balance = (parseInt(data.balance) / 1000000).toFixed(6);
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
   * Refresca el balance del usuario
   */
  const refreshBalance = async () => {
    if (userAddress) {
      await fetchUserBalance(userAddress);
    }
  };

  /**
   * Transfiere STX a otra wallet usando el contrato
   */
  const transferSTX = async (recipient: string, amount: number) => {
    if (!isConnected || !userAddress) {
      setTransactionError('Debes conectar tu wallet primero');
      return;
    }

    if (!recipient || recipient.trim() === '') {
      setTransactionError('Debes proporcionar una dirección de destinatario válida');
      return;
    }

    if (amount <= 0) {
      setTransactionError('El monto debe ser mayor a 0');
      return;
    }

    setIsTransactionPending(true);
    setTransactionError(null);
    setTransactionSuccess(null);
    setTransactionId(null);

    try {
      // Convertir el monto de STX a microSTX
      const amountInMicroSTX = Math.floor(amount * 1000000);

      showContractCall({
        contractAddress: TRANSFER_CONTRACT_ADDRESS,
        contractName: TRANSFER_CONTRACT_NAME,
        functionName: TRANSFER_CONTRACT_FUNCTIONS.TRANSFER_STX,
        functionArgs: [
          principalCV(recipient),
          uintCV(amountInMicroSTX)
        ],
        network: NETWORK.chainId === 2147483648 ? 'testnet' : 'mainnet',
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: (data: any) => {
          console.log('Transfer transaction submitted:', data.txId);
          setTransactionId(data.txId);
          setIsTransactionPending(false);
          setTransactionSuccess(`¡Transferencia de ${amount} STX enviada exitosamente!`);
          
          // Actualizar balance del usuario después de unos segundos
          setTimeout(() => {
            if (userAddress) {
              fetchUserBalance(userAddress);
            }
          }, 5000);
        },
        onCancel: () => {
          console.log('Transaction cancelled');
          setIsTransactionPending(false);
          setTransactionError('Transacción cancelada por el usuario');
        },
      });
    } catch (error: any) {
      console.error('Error transferring STX:', error);
      setTransactionError(error.message || 'Error al realizar la transferencia');
      setIsTransactionPending(false);
    }
  };

  return {
    // Wallet
    userAddress,
    isConnected,
    userBalance,
    
    // Transacciones
    isTransactionPending,
    transactionId,
    transactionError,
    transactionSuccess,
    
    // Funciones
    connectWallet,
    disconnectWallet,
    transferSTX,
    refreshBalance,
  };
};
