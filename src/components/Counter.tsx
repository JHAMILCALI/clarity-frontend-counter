/**
 * Componente Counter - Interfaz principal para interactuar con el contrato
 * Muestra el contador actual y permite incrementarlo mediante transacciones en Stacks
 */

import { useStacksContract } from '../hooks/useStacksContract';
import { getTransactionUrl, getContractUrl } from '../config/contract';

export const Counter = () => {
  const {
    // Wallet
    userAddress,
    isConnected,
    
    // Contador
    count,
    isLoadingCount,
    countError,
    
    // Transacciones
    isTransactionPending,
    transactionId,
    transactionError,
    
    // Balance
    userBalance,
    
    // Funciones
    connectWallet,
    disconnectWallet,
    incrementCounter,
    refreshCount,
  } = useStacksContract();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔢 Contador en Stacks
          </h1>
          <p className="text-purple-200 text-lg">
            Contrato inteligente desplegado en testnet
          </p>
          <a
            href={getContractUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-300 hover:text-purple-100 text-sm underline mt-2 inline-block"
          >
            Ver contrato en Explorer →
          </a>
        </div>

        {/* Wallet Connection Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              {isConnected ? (
                <div>
                  <p className="text-purple-200 text-sm mb-1">Conectado como:</p>
                  <p className="text-white font-mono text-sm break-all">
                    {userAddress}
                  </p>
                  {userBalance && (
                    <p className="text-purple-300 text-sm mt-2">
                      Balance: <span className="font-semibold">{userBalance} STX</span>
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-purple-200 text-sm mb-1">Wallet Status:</p>
                  <p className="text-white font-semibold">No conectado</p>
                </div>
              )}
            </div>
            
            <div>
              {isConnected ? (
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105"
                >
                  🔐 Conectar Leather Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Counter Display Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-2xl border border-white/20">
          <div className="text-center">
            <p className="text-purple-200 text-lg mb-4">Valor Actual del Contador</p>
            
            {isLoadingCount && count === null ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-white">Cargando...</span>
              </div>
            ) : countError ? (
              <div className="text-red-400">
                <p>❌ {countError}</p>
                <button
                  onClick={refreshCount}
                  className="mt-4 text-sm text-purple-300 hover:text-purple-100 underline"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-8xl font-bold text-white animate-pulse">
                  {count !== null ? count : '---'}
                </div>
                
                <button
                  onClick={refreshCount}
                  disabled={isLoadingCount}
                  className="text-sm text-purple-300 hover:text-purple-100 underline disabled:opacity-50"
                >
                  🔄 Actualizar ahora
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl border border-white/20">
          <button
            onClick={incrementCounter}
            disabled={!isConnected || isTransactionPending}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg ${
              !isConnected
                ? 'bg-gray-500 cursor-not-allowed opacity-50'
                : isTransactionPending
                ? 'bg-yellow-500 cursor-wait'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
            } text-white`}
          >
            {!isConnected ? (
              '🔒 Conecta tu wallet para incrementar'
            ) : isTransactionPending ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Procesando transacción...</span>
              </span>
            ) : (
              '➕ Incrementar Contador'
            )}
          </button>

          {!isConnected && (
            <p className="text-purple-300 text-sm text-center mt-3">
              💡 Necesitas conectar Leather Wallet para realizar transacciones
            </p>
          )}
        </div>

        {/* Transaction Status Card */}
        {(transactionId || transactionError) && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            {transactionError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-200 font-semibold mb-1">❌ Error en la transacción</p>
                <p className="text-red-300 text-sm">{transactionError}</p>
              </div>
            )}

            {transactionId && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-200 font-semibold mb-2">✅ Transacción enviada</p>
                <p className="text-green-300 text-sm mb-3 break-all">
                  <span className="font-semibold">TX ID:</span> {transactionId}
                </p>
                <a
                  href={getTransactionUrl(transactionId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  🔍 Ver en Explorer
                </a>
                <p className="text-green-300 text-xs mt-3">
                  ⏳ El contador se actualizará automáticamente en unos segundos...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3 text-lg">ℹ️ Información</h3>
          <ul className="text-purple-200 text-sm space-y-2">
            <li>• El contador se actualiza automáticamente cada 10 segundos</li>
            <li>• Las transacciones requieren confirmación en tu Leather Wallet</li>
            <li>• Necesitas STX de testnet para pagar las fees</li>
            <li>• Puedes obtener STX gratis en el <a href="https://explorer.hiro.so/sandbox/faucet?chain=testnet" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-100 underline">faucet de testnet</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
