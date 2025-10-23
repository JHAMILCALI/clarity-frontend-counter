/**
 * Configuración del contrato de transferencia STX
 */

import { STACKS_TESTNET } from '@stacks/network';

// Configuración de la red
export const NETWORK = STACKS_TESTNET;

// Dirección del contrato de transferencia desplegado
export const TRANSFER_CONTRACT_ADDRESS = 'ST3AQ7KXWA7KGQ67EX2MFYR1E3231B9S4KY6EFB1R';
export const TRANSFER_CONTRACT_NAME = 'traspaso-v2';

// Nombre completo del contrato
export const TRANSFER_CONTRACT_PRINCIPAL = `${TRANSFER_CONTRACT_ADDRESS}.${TRANSFER_CONTRACT_NAME}`;

// Nombres de las funciones del contrato
export const TRANSFER_CONTRACT_FUNCTIONS = {
  TRANSFER_STX: 'transfer-stx',
  GET_BALANCE: 'get-balance',
  GET_SENDER_INFO: 'get-sender-info',
} as const;

// Códigos de error del contrato
export const TRANSFER_ERRORS = {
  ERR_INSUF_BALANCE: 100,
  ERR_TRANSFER_FAILED: 101,
  ERR_INVALID_AMOUNT: 102,
} as const;
