/**
 * Configuración del contrato inteligente de Stacks
 * Este archivo contiene las constantes necesarias para interactuar con el contrato desplegado en testnet
 */

import { STACKS_TESTNET } from '@stacks/network';

// Configuración de la red
export const NETWORK = STACKS_TESTNET;

// Dirección del contrato desplegado
export const CONTRACT_ADDRESS = 'ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW';
export const CONTRACT_NAME = 'contador';

// Nombre completo del contrato (principal)
export const CONTRACT_PRINCIPAL = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;

// Nombres de las funciones del contrato
export const CONTRACT_FUNCTIONS = {
  GET_COUNT: 'get-count',
  INCREMENT: 'increment',
} as const;

// URLs útiles
export const EXPLORER_URL = 'https://explorer.hiro.so';
export const EXPLORER_TESTNET_URL = `${EXPLORER_URL}?chain=testnet`;
export const API_URL = 'https://api.testnet.hiro.so';

// Función helper para obtener la URL del explorer para una transacción
export const getTransactionUrl = (txId: string): string => {
  return `${EXPLORER_URL}/txid/${txId}?chain=testnet`;
};

// Función helper para obtener la URL del explorer para el contrato
export const getContractUrl = (): string => {
  return `${EXPLORER_URL}/txid/${CONTRACT_PRINCIPAL}?chain=testnet`;
};

// Configuración de polling (cada cuánto actualizar el contador)
export const POLLING_INTERVAL = 10000; // 10 segundos
