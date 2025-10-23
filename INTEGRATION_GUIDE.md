# 📚 Guía de Integración - Contador Stacks con React

## 🎯 Resumen del Proyecto

Has integrado exitosamente tu contrato inteligente de Stacks con una aplicación React moderna usando TypeScript y Tailwind CSS.

**Contrato Desplegado:**
- **Principal:** `ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW.contador`
- **Red:** Testnet
- **Explorer:** [Ver Contrato](https://explorer.hiro.so/txid/ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW.contador?chain=testnet)

---

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── contract.ts          # Configuración del contrato y constantes
├── hooks/
│   └── useStacksContract.ts # Custom hook con toda la lógica
├── components/
│   └── Counter.tsx          # Componente UI principal
├── App.tsx                  # Aplicación principal
├── main.tsx                 # Entry point
└── index.css                # Estilos con Tailwind
```

---

## 🚀 Cómo Iniciar la Aplicación

### 1. Instalar dependencias (ya completado)
```bash
cd /home/omarqv/Clarinet/mi-primer-proyecto
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🔑 Funcionalidades Implementadas

### ✅ Conexión de Wallet
- **Leather Wallet** (anteriormente Hiro Wallet)
- Conectar/Desconectar wallet
- Mostrar dirección del usuario
- Mostrar balance de STX

### ✅ Lectura del Contrato (Read-Only)
- Función: `get-count`
- No requiere wallet conectada
- Actualización automática cada 10 segundos (polling)
- Botón de actualización manual

### ✅ Escritura al Contrato (Transacción)
- Función: `increment`
- Requiere wallet conectada
- Confirmación mediante Leather Wallet
- Feedback visual durante el proceso
- Link al Explorer para ver la transacción

### ✅ Manejo de Estados
- Loading durante operaciones
- Mensajes de error claros
- Confirmación de transacciones exitosas
- Estados de botones (disabled/enabled)

---

## 🧪 Cómo Probar la Aplicación

### Paso 1: Instalar Leather Wallet
1. Ve a [leather.io](https://leather.io/) o busca "Leather Wallet" en la Chrome Web Store
2. Instala la extensión
3. Crea una wallet nueva o importa una existente
4. **IMPORTANTE:** Cambia la red a **Testnet**

### Paso 2: Obtener STX de Testnet
1. Ve al [Faucet de Testnet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
2. Pega tu dirección de Stacks (comienza con ST...)
3. Solicita STX gratis
4. Espera la confirmación

### Paso 3: Usar la Aplicación
1. Abre `http://localhost:5173`
2. Haz clic en "Conectar Leather Wallet"
3. Autoriza la conexión en la extensión
4. Observa el contador actual (se actualiza solo)
5. Haz clic en "Incrementar Contador"
6. Confirma la transacción en Leather Wallet
7. Espera 10-30 segundos para ver el cambio

---

## 🐛 Debugging y Solución de Problemas

### Problema: No puedo conectar mi wallet

**Solución:**
1. Verifica que Leather Wallet esté instalada
2. Asegúrate de estar en la red **Testnet** (no Mainnet)
3. Recarga la página
4. Abre la consola del navegador (F12) y busca errores

```javascript
// En la consola del navegador:
console.log('UserSession:', userSession);
```

### Problema: El contador no se actualiza

**Solución:**
1. Verifica que el contrato esté desplegado correctamente
2. Comprueba la URL en `src/config/contract.ts`
3. Revisa la consola para errores de red

```javascript
// Test manual en la consola:
import { callReadOnlyFunction } from '@stacks/transactions';

callReadOnlyFunction({
  contractAddress: 'ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW',
  contractName: 'contador',
  functionName: 'get-count',
  functionArgs: [],
  network: new StacksTestnet(),
  senderAddress: 'ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW',
}).then(result => console.log('Count:', cvToValue(result)));
```

### Problema: La transacción falla

**Causas comunes:**
1. **Sin STX:** Necesitas STX de testnet para pagar fees
2. **Red incorrecta:** Asegúrate de estar en Testnet
3. **Wallet bloqueada:** Desbloquea Leather Wallet
4. **Transacción cancelada:** Confirma en la wallet

**Verificar en el Explorer:**
```
https://explorer.hiro.so/txid/[TX_ID]?chain=testnet
```

### Problema: Error de CORS o API

**Solución:**
- La API de testnet es: `https://api.testnet.hiro.so`
- Si hay problemas de red, verifica tu conexión
- Revisa el status de la API: [Hiro Status](https://status.hiro.so/)

---

## 🔍 Verificar Transacciones

### Ver tu Transacción
Después de incrementar, obtendrás un Transaction ID. Usa estos enlaces:

```
https://explorer.hiro.so/txid/[TX_ID]?chain=testnet
```

### Ver el Contrato
```
https://explorer.hiro.so/txid/ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW.contador?chain=testnet
```

### Estados de una Transacción
1. **Pending:** Enviada pero no confirmada
2. **Success:** Confirmada y ejecutada
3. **Failed:** Falló (revisa el motivo en el Explorer)

---

## 🛠️ Testing Local del Hook

Puedes probar el hook independientemente creando un componente de prueba:

```typescript
// src/components/TestHook.tsx
import { useStacksContract } from '../hooks/useStacksContract';

export const TestHook = () => {
  const contract = useStacksContract();
  
  console.log('Hook state:', {
    count: contract.count,
    isConnected: contract.isConnected,
    userAddress: contract.userAddress,
  });
  
  return (
    <div>
      <h1>Test del Hook</h1>
      <pre>{JSON.stringify(contract, null, 2)}</pre>
    </div>
  );
};
```

---

## 📊 Monitoreo en la Consola

Abre la consola del navegador (F12) para ver logs útiles:

```javascript
// Logs automáticos del hook:
// ✓ "Transaction submitted: [txId]"
// ✓ "Transaction cancelled"
// ✗ "Error fetching count:"
// ✗ "Error calling contract:"
```

---

## 🎨 Personalización

### Cambiar el Intervalo de Polling
```typescript
// src/config/contract.ts
export const POLLING_INTERVAL = 5000; // 5 segundos en vez de 10
```

### Modificar Estilos
Los estilos usan Tailwind CSS. Puedes personalizar colores en `src/components/Counter.tsx`:

```typescript
// Ejemplo: Cambiar color del botón de incrementar
className="bg-gradient-to-r from-blue-500 to-cyan-600"
```

### Agregar Nuevas Funciones del Contrato

1. **Actualiza `src/config/contract.ts`:**
```typescript
export const CONTRACT_FUNCTIONS = {
  GET_COUNT: 'get-count',
  INCREMENT: 'increment',
  DECREMENT: 'decrement', // Nueva función
} as const;
```

2. **Agrega la función en el hook:**
```typescript
const decrementCounter = async () => {
  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: CONTRACT_FUNCTIONS.DECREMENT,
    // ... resto del código
  });
};
```

3. **Agrega el botón en el componente:**
```typescript
<button onClick={decrementCounter}>
  Decrementar
</button>
```

---

## 🔐 Seguridad y Mejores Prácticas

### ✅ Implementado
- PostConditions para proteger transacciones
- Validación de wallet conectada antes de transacciones
- Manejo de errores exhaustivo
- Network específico (Testnet)

### 🚨 Antes de Producción (Mainnet)
1. **Cambiar la red:**
```typescript
// src/config/contract.ts
import { StacksMainnet } from '@stacks/network';
export const NETWORK = new StacksMainnet();
```

2. **Actualizar el contract address** (el de mainnet será diferente)

3. **Agregar PostConditions estrictas** si transfieres STX

4. **Testing exhaustivo** en testnet primero

---

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Ver árbol de dependencias
npm list @stacks/connect @stacks/transactions @stacks/network
```

---

## 🔗 Enlaces Importantes

- **Stacks Docs:** https://docs.stacks.co/
- **Leather Wallet:** https://leather.io/
- **Testnet Explorer:** https://explorer.hiro.so/?chain=testnet
- **Testnet Faucet:** https://explorer.hiro.so/sandbox/faucet?chain=testnet
- **Stacks API:** https://api.testnet.hiro.so
- **Hiro Platform:** https://platform.hiro.so/

---

## 💡 Tips y Trucos

### Depurar llamadas read-only
```bash
# Usando curl para probar el endpoint
curl -X POST https://api.testnet.hiro.so/v2/contracts/call-read/ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW/contador/get-count \
-H "Content-Type: application/json" \
-d '{
  "sender": "ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW",
  "arguments": []
}'
```

### Ver logs de Leather Wallet
1. Abre Leather Wallet
2. Click derecho > "Inspect"
3. Ve a la pestaña Console
4. Verás logs de las transacciones

### Forzar actualización del contador
Cambia `POLLING_INTERVAL` a `3000` (3 segundos) temporalmente para ver cambios más rápido.

---

## 🎯 Próximos Pasos

1. **Agregar más funciones del contrato** (si las tienes)
2. **Implementar un historial de transacciones** usando la API de Stacks
3. **Agregar notificaciones** cuando cambie el contador
4. **Crear tests unitarios** para el hook
5. **Optimizar polling** con WebSockets o Server-Sent Events
6. **Agregar soporte para múltiples contratos**

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar otra wallet además de Leather?**  
R: Sí, pero necesitarías modificar el código. Leather es la recomendada para Stacks.

**P: ¿Cuánto cuestan las transacciones?**  
R: En testnet son gratis (con STX de testnet). En mainnet, las fees varían según la congestión de la red.

**P: ¿Cómo puedo ver el código del contrato?**  
R: Ve al Explorer y busca tu contrato, verás el código Clarity ahí.

**P: ¿Funciona en mobile?**  
R: Sí, pero necesitas usar la wallet mobile de Leather o una compatible con WalletConnect.

---

## 🤝 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica el Explorer de testnet
3. Consulta la [documentación de Stacks](https://docs.stacks.co/)
4. Únete al [Discord de Stacks](https://discord.gg/stacks)

---

¡Felicitaciones! 🎉 Tu aplicación está lista para usar. Happy coding! 🚀
