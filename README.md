# 🔢 Contador en Stacks - Frontend React

Una aplicación React moderna que interactúa con un contrato inteligente de Clarity desplegado en Stacks Testnet. Permite a los usuarios conectar su wallet Leather y ejecutar transacciones para incrementar un contador en el blockchain.

![Stacks](https://img.shields.io/badge/Stacks-Testnet-5546FF?style=for-the-badge&logo=stacks&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🌟 Características

- ✅ **Conexión con Leather Wallet** - Integración completa con la wallet de Stacks
- ✅ **Lectura del Contador** - Llamadas read-only sin necesidad de wallet
- ✅ **Incrementar Contador** - Transacciones en blockchain con confirmación
- ✅ **Actualización Automática** - Polling cada 10 segundos del valor actual
- ✅ **Balance de STX** - Muestra el balance del usuario conectado
- ✅ **Explorer Links** - Enlaces directos al Stacks Explorer
- ✅ **UI Moderna** - Diseño con Tailwind CSS y glassmorphism
- ✅ **TypeScript** - Tipado completo para mayor seguridad
- ✅ **Custom Hook** - Lógica reutilizable con `useStacksContract`

---

## 📋 Tabla de Contenidos

- [Demo](#-demo)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Contrato Inteligente](#-contrato-inteligente)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)

---

## 🚀 Demo

**Contrato en Testnet:** [ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW.contador](https://explorer.hiro.so/txid/ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW.contador?chain=testnet)

**Red:** Stacks Testnet  
**Explorer:** https://explorer.hiro.so/?chain=testnet

---

## 📦 Instalación

### Prerequisitos

- Node.js >= 18.x
- npm o yarn
- Leather Wallet (extensión de navegador)

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/OmarQV/clarity-frontend-counter.git
cd clarity-frontend-counter

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Configurar el Contrato

El contrato está configurado en `src/config/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = 'ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW';
export const CONTRACT_NAME = 'contador';
export const NETWORK = STACKS_TESTNET;
```

Para usar tu propio contrato:
1. Despliega tu contrato en testnet
2. Actualiza `CONTRACT_ADDRESS` y `CONTRACT_NAME`
3. Reinicia el servidor de desarrollo

### Variables de Entorno (Opcional)

Puedes crear un archivo `.env` para configuraciones adicionales:

```env
VITE_CONTRACT_ADDRESS=ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW
VITE_CONTRACT_NAME=contador
VITE_NETWORK=testnet
```

---

## 🎯 Uso

### 1. Conectar Wallet

1. Instala [Leather Wallet](https://leather.io/)
2. Configura la wallet en **Testnet**
3. Abre la aplicación: http://localhost:5173
4. Click en "**Conectar Leather Wallet**"
5. Autoriza la conexión

### 2. Obtener STX de Testnet

Necesitas STX de testnet para pagar las fees de transacción:

1. Ve al [Faucet de Testnet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
2. Pega tu dirección de Stacks (ST...)
3. Solicita tokens gratis
4. Espera la confirmación (~30 segundos)

### 3. Incrementar el Contador

1. Asegúrate de tener la wallet conectada
2. Click en "**Incrementar Contador**"
3. Confirma la transacción en Leather Wallet
4. Espera la confirmación en blockchain
5. El contador se actualizará automáticamente

---

## 📁 Estructura del Proyecto

```
mi-primer-proyecto/
├── src/
│   ├── config/
│   │   └── contract.ts           # Configuración del contrato
│   ├── hooks/
│   │   └── useStacksContract.ts  # Custom hook con lógica del contrato
│   ├── components/
│   │   └── Counter.tsx           # Componente principal UI
│   ├── App.tsx                   # Aplicación principal
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos globales con Tailwind
├── public/
├── INTEGRATION_GUIDE.md          # Guía completa de integración
├── QUICKSTART.md                 # Inicio rápido
├── WALLET_FIX.md                 # Solución de problemas
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.js
```

### Archivos Principales

#### `src/config/contract.ts`
Configuración centralizada del contrato y red.

#### `src/hooks/useStacksContract.ts`
Custom hook React con toda la lógica:
- Conexión de wallet
- Lectura del contador
- Incrementar contador
- Manejo de estados
- Polling automático

#### `src/components/Counter.tsx`
Componente UI con:
- Interfaz de conexión de wallet
- Visualización del contador
- Botón de incremento
- Estados de transacción
- Mensajes de error/éxito

---

## 🛠️ Tecnologías

### Frontend
- **React 19.1.1** - Biblioteca UI
- **TypeScript 5.7** - Tipado estático
- **Vite 7.1** - Build tool y dev server
- **Tailwind CSS 4.0** - Framework CSS utility-first

### Stacks Integration
- **@stacks/connect 8.2.0** - Conexión con wallets
- **@stacks/transactions 6.x** - Interacción con blockchain
- **@stacks/network 6.x** - Configuración de red

### DevTools
- **ESLint** - Linting
- **PostCSS** - Procesamiento CSS
- **Autoprefixer** - Prefijos CSS automáticos

---

## 📜 Contrato Inteligente

### Información del Contrato

```clarity
;; Contract: contador
;; Address: ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW
;; Network: Testnet
```

### Funciones Disponibles

#### `get-count` (read-only)
Lee el valor actual del contador sin necesidad de wallet.

```clarity
(define-read-only (get-count)
  (ok counter)
)
```

**Uso en la app:**
```typescript
const count = await fetchCallReadOnlyFunction({
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName: 'get-count',
  functionArgs: [],
  network: NETWORK,
  senderAddress: CONTRACT_ADDRESS,
});
```

#### `increment` (public)
Incrementa el contador en 1. Requiere transacción firmada.

```clarity
(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))
  )
)
```

**Uso en la app:**
```typescript
showContractCall({
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName: 'increment',
  functionArgs: [],
  network: 'testnet',
  onFinish: (data) => {
    console.log('TX ID:', data.txId);
  }
});
```

---

## 📚 Documentación

### Guías Disponibles

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Guía completa de integración (400+ líneas)
  - Estructura del proyecto
  - Cómo funciona cada componente
  - Debugging y solución de problemas
  - Testing local
  - Personalización

- **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido
  - Pasos básicos para empezar
  - Enlaces importantes
  - Información del contrato

- **[WALLET_FIX.md](./WALLET_FIX.md)** - Solución de problemas con wallet
  - Errores comunes
  - Soluciones aplicadas
  - API de @stacks/connect v8

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (http://localhost:5173)

# Producción
npm run build        # Compila para producción
npm run preview      # Preview del build

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 🔍 Funcionalidades Detalladas

### Custom Hook: `useStacksContract`

El hook retorna:

```typescript
{
  // Estado de wallet
  userAddress: string | null;
  isConnected: boolean;
  userBalance: string | null;
  
  // Estado del contador
  count: number | null;
  isLoadingCount: boolean;
  countError: string | null;
  
  // Estado de transacciones
  isTransactionPending: boolean;
  transactionId: string | null;
  transactionError: string | null;
  
  // Funciones
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  incrementCounter: () => Promise<void>;
  refreshCount: () => Promise<void>;
}
```

### Polling Automático

El contador se actualiza automáticamente cada 10 segundos:

```typescript
useEffect(() => {
  fetchCount();
  const interval = setInterval(fetchCount, POLLING_INTERVAL);
  return () => clearInterval(interval);
}, [fetchCount]);
```

Puedes ajustar el intervalo en `src/config/contract.ts`:

```typescript
export const POLLING_INTERVAL = 10000; // milisegundos
```

---

## 🐛 Debugging

### Logs en Consola

La aplicación genera logs útiles:

```javascript
// ✓ Éxito
"Transaction submitted: [txId]"

// ✗ Error
"Error fetching count:"
"Error connecting wallet:"
"Error calling contract:"
```

### Verificar Transacciones

Usa el Explorer de testnet para ver el estado de tus transacciones:

```
https://explorer.hiro.so/txid/[TX_ID]?chain=testnet
```

### Problemas Comunes

1. **"No hay wallet conectada"**
   - Instala Leather Wallet
   - Configura en Testnet
   - Recarga la página

2. **"Sin STX para fees"**
   - Ve al [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
   - Solicita tokens gratis

3. **"Contador no se actualiza"**
   - Espera 10-30 segundos después de la transacción
   - Click en "Actualizar ahora"
   - Verifica la transacción en el Explorer

---

## 🚀 Deploy

### Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy carpeta dist/
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
# Agregar en vite.config.js
export default defineConfig({
  base: '/clarity-frontend-counter/',
  // ...
})

# Build y deploy
npm run build
git subtree push --prefix dist origin gh-pages
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! 

### Cómo Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### Lineamientos

- Usa TypeScript
- Sigue las convenciones de código (ESLint)
- Agrega tests si es posible
- Actualiza la documentación

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👤 Autor

**Omar Quintero**

- GitHub: [@OmarQV](https://github.com/OmarQV)
- Proyecto: [clarity-frontend-counter](https://github.com/OmarQV/clarity-frontend-counter)

---

## 🙏 Agradecimientos

- [Stacks Blockchain](https://www.stacks.co/)
- [Hiro Systems](https://www.hiro.so/)
- [Leather Wallet](https://leather.io/)
- Comunidad de Stacks

---

## 🔗 Enlaces Útiles

- **Stacks Docs:** https://docs.stacks.co/
- **Clarity Language:** https://docs.stacks.co/clarity/
- **Stacks.js:** https://stacks.js.org/
- **Testnet Explorer:** https://explorer.hiro.so/?chain=testnet
- **Testnet Faucet:** https://explorer.hiro.so/sandbox/faucet?chain=testnet
- **Discord de Stacks:** https://discord.gg/stacks

---

## ⭐ Apoyo

Si este proyecto te fue útil, considera darle una estrella ⭐ en GitHub!

---

**Hecho con ❤️ usando Stacks y React**

