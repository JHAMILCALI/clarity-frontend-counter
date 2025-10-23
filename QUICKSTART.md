# 🚀 Quick Start - ¡PROYECTO LISTO!

## ✅ El servidor está corriendo en:
**http://localhost:5173/**

---

## Iniciar el proyecto

```bash
npm run dev
```

**ESTADO ACTUAL:** ✅ El servidor de desarrollo ya está corriendo.

---

## ⚡ Primeros Pasos

1. **Instala Leather Wallet** (extensión del navegador)
   - Ve a: https://leather.io/
   
2. **Configura Testnet** en la wallet
   - IMPORTANTE: Cambia de Mainnet a Testnet en la configuración
   
3. **Obtén STX gratis:** https://explorer.hiro.so/sandbox/faucet?chain=testnet
   - Pega tu dirección (ST...)
   - Solicita tokens
   
4. **Abre la aplicación:** http://localhost:5173/
   
5. **Conecta tu wallet** en la aplicación
   
6. **Incrementa el contador** y disfruta! 🎉

---

## 🎯 Funcionalidades Implementadas

- ✅ Conexión con Leather Wallet
- ✅ Lectura del contador (no requiere wallet)
- ✅ Incrementar contador (requiere wallet + STX)
- ✅ Actualización automática cada 10 segundos
- ✅ Mostrar balance de STX
- ✅ Ver transacciones en el Explorer
- ✅ UI moderna con Tailwind CSS
- ✅ TypeScript con tipos completos
- ✅ Custom hook `useStacksContract`

---

## 📚 Documentación Completa

Lee [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) para:
- Guía detallada de uso
- Debugging y troubleshooting
- Personalización y extensión
- Mejores prácticas

## 🏗️ Estructura

```
src/
├── config/contract.ts       # Configuración del contrato
├── hooks/useStacksContract.ts # Lógica del contrato
├── components/Counter.tsx   # Componente principal
└── App.tsx                  # App
```

## 📦 Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **@stacks/connect** (wallet)
- **@stacks/transactions** (blockchain)

## 🔗 Enlaces Útiles

- [Tu Contrato](https://explorer.hiro.so/txid/ST3MHY0Z6DK6KC137X9XZQ4R61Y1PNRDN90MB3YHW.contador?chain=testnet)
- [Stacks Docs](https://docs.stacks.co/)
- [Leather Wallet](https://leather.io/)
