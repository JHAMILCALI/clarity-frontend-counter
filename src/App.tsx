import { useState } from 'react'
import { Counter } from './components/Counter'
import ChatBot from './components/ChatBot'
import Transfer from './components/Transfer'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'counter' | 'chat' | 'transfer'>('transfer')

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Stacks Clarity Frontend</h1>
        <div className="app-tabs">
          <button 
            className={`tab-btn ${activeTab === 'counter' ? 'active' : ''}`}
            onClick={() => setActiveTab('counter')}
          >
            Contador
          </button>
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            Transferencias
          </button>
        </div>
      </div>

      <div className="app-content">
        {activeTab === 'counter' ? (
          <Counter />
        ) : activeTab === 'chat' ? (
          <ChatBot />
        ) : (
          <Transfer />
        )}
      </div>
    </div>
  )
}

export default App
