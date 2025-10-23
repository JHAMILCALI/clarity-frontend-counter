/**
 * Servicio para comunicarse con el backend Flask para el chatbot y transferencias
 */

// URL base del backend (ajustar según tu configuración)
//const API_BASE_URL = "http://localhost:5000"; // Cambia esto si tu backend está en otro puerto o dominio
const API_BASE_URL = "https://clarity-backend-duun.onrender.com";
/**
 * Envía un mensaje al chatbot y recibe una acción recomendada
 * @param message - El mensaje del usuario para el chatbot
 */
export const sendChatMessage = async (message: string): Promise<{
  action: 'increment' | 'read' | 'transfer' | 'balance' | 'none';
  message: string;
  recipient?: string;
  amount?: number;
  address?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar mensaje al chatbot:', error);
    return {
      action: 'none',
      message: 'Lo siento, ha ocurrido un error al procesar tu mensaje.'
    };
  }
};

/**
 * Obtiene el valor actual del contador desde el backend
 */
export const getCounterValue = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-count`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el contador');
    }

    const data = await response.json();
    // Convertir a entero para evitar notación científica
    return Math.floor(Number(data.count));
  } catch (error) {
    console.error('Error al obtener el contador:', error);
    throw error;
  }
};

/**
 * Consulta el balance de una wallet de Stacks
 * @param address - Dirección de la wallet
 */
export const getWalletBalance = async (address: string): Promise<{
  address: string;
  balance: number;
  balance_microstx: number;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el balance');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener el balance:', error);
    throw error;
  }
};

/**
 * Prepara los datos para una transferencia de STX
 * @param sender - Dirección del remitente
 * @param recipient - Dirección del destinatario
 * @param amount - Cantidad de STX a transferir
 */
export const prepareTransfer = async (
  sender: string,
  recipient: string,
  amount: number
): Promise<{
  contract_address: string;
  contract_name: string;
  function_name: string;
  function_args: string[];
  sender: string;
  recipient: string;
  amount: number;
  amount_microstx: number;
  network: string;
  post_condition_mode: string;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prepare-transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender, recipient, amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al preparar la transferencia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al preparar la transferencia:', error);
    throw error;
  }
};

/**
 * Verifica el estado de una transacción
 * @param txid - ID de la transacción
 */
export const checkTransaction = async (txid: string): Promise<{
  txid: string;
  status: string;
  block_height?: number;
  block_hash?: string;
  explorer_url: string;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    });

    if (!response.ok) {
      throw new Error('Error al verificar la transacción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar la transacción:', error);
    throw error;
  }
};