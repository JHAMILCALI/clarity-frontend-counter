/**
 * Componente para transferir STX usando el contrato simplificado
 * Cualquier usuario puede transferir STX a otra wallet
 */

import React, { useState } from 'react';
import { useTransferContract } from '../hooks/useTransferContract';
import './Transfer.css';

const Transfer: React.FC = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const {
    userAddress,
    isConnected,
    userBalance,
    isTransactionPending,
    transactionId,
    transactionError,
    transactionSuccess,
    connectWallet,
    disconnectWallet,
    transferSTX,
    refreshBalance,
  } = useTransferContract();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      return;
    }

    await transferSTX(recipientAddress, amountNum);
    
    // Limpiar formulario después de enviar
    setRecipientAddress('');
    setAmount('');
  };

  return (
    <div className="transfer-container">
      <div className="transfer-header">
        <h2>💸 Transferencia de STX</h2>
        <p className="transfer-subtitle">Transfiere STX a otra wallet usando blockchain de Stacks</p>
      </div>

      {/* Información de la wallet */}
      <div className="wallet-section">
        {isConnected ? (
          <div className="wallet-connected">
            <div className="wallet-info-grid">
              <div className="info-item">
                <span className="info-label">Tu dirección:</span>
                <span className="info-value">
                  {userAddress ? `${userAddress.substring(0, 8)}...${userAddress.substring(userAddress.length - 6)}` : ''}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Tu balance:</span>
                <span className="info-value">{userBalance} STX</span>
              </div>
            </div>
            <div className="wallet-buttons">
              <button onClick={refreshBalance} className="btn btn-secondary btn-small">
                🔄 Actualizar Balance
              </button>
              <button onClick={disconnectWallet} className="btn btn-secondary">
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn btn-primary btn-large">
            Conectar Wallet
          </button>
        )}
      </div>

      {/* Información del contrato */}
      <div className="contract-info-section">
        <h3>ℹ️ Sobre este contrato</h3>
        <div className="info-box">
          <p>✅ <strong>Cualquier usuario</strong> puede transferir STX a otra dirección</p>
          <p>✅ Las transferencias se realizan de forma <strong>segura</strong> en la blockchain de Stacks</p>
          <p>✅ No se requieren permisos especiales</p>
        </div>
        <div className="contract-address">
          <span className="info-label">Dirección del contrato:</span>
          <span className="info-value small">ST3AQ7KXWA7KGQ67EX2MFYR1E3231B9S4KY6EFB1R.traspaso-v2</span>
        </div>
      </div>

      {/* Formulario de transferencia */}
      {isConnected && (
        <div className="transfer-form-section">
          <h3>📤 Enviar STX</h3>
          
          <form onSubmit={handleTransfer} className="transfer-form">
            <div className="form-group">
              <label htmlFor="recipient">Dirección del destinatario:</label>
              <input
                type="text"
                id="recipient"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="ST... (dirección de Stacks)"
                disabled={isTransactionPending}
                required
              />
              <small className="input-hint">Ingresa la dirección de la wallet que recibirá los STX</small>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Monto (STX):</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000000"
                step="0.000001"
                min="0.000001"
                disabled={isTransactionPending}
                required
              />
              <small className="input-hint">Balance disponible: {userBalance} STX</small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={isTransactionPending || !recipientAddress || !amount}
            >
              {isTransactionPending ? '⏳ Procesando transferencia...' : '💸 Transferir STX'}
            </button>
          </form>
        </div>
      )}

      {!isConnected && (
        <div className="info-section">
          <p className="info-text">
            👆 Conecta tu wallet para comenzar a transferir STX
          </p>
        </div>
      )}

      {/* Mensajes de estado */}
      {transactionError && (
        <div className="message message-error">
          ❌ {transactionError}
        </div>
      )}

      {transactionSuccess && (
        <div className="message message-success">
          ✅ {transactionSuccess}
          {transactionId && (
            <div className="transaction-link">
              <a 
                href={`https://explorer.hiro.so/txid/${transactionId}?chain=testnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver transacción en el explorador →
              </a>
            </div>
          )}
        </div>
      )}

      {isTransactionPending && (
        <div className="message message-pending">
          ⏳ Esperando confirmación de la transacción...
          <p className="pending-details">Por favor, aprueba la transacción en tu wallet</p>
        </div>
      )}
    </div>
  );
};

export default Transfer;
