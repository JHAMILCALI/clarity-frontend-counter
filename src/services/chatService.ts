/**
 * Servicio para comunicarse con el backend Flask para el chatbot
 */

// URL base del backend (ajustar según tu configuración)
const API_BASE_URL = "http://localhost:5000"; // Cambia esto si tu backend está en otro puerto o dominio

/**
 * Envía un mensaje al chatbot y recibe una acción recomendada
 * @param message - El mensaje del usuario para el chatbot
 */
export const sendChatMessage = async (message: string): Promise<{
  action: 'increment' | 'read' | 'none';
  message: string;
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