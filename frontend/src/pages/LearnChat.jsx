import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'https://study-buddy-backend-reh8.onrender.com'

export default function LearnChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const addMessage = (role, content) => setMessages(prev => [...prev, { role, content }])

  const send = async (promptOverride) => {
    if (!input && !file) return
    setLoading(true)
    addMessage('user', input || (file ? `Uploaded: ${file.name}` : ''))

    try {
      let res
      if (file) {
        const form = new FormData()
        form.append('file', file)
        res = await axios.post(`${API}/summarize/file`, form)
        setFile(null)
      } else {
        res = await axios.post(`${API}/summarize`, { text: input, prompt: promptOverride })
      }
      addMessage('assistant', res.data.summary)
      setInput('')
    } catch (e) {
      addMessage('assistant', 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const saveLast = async () => {
    const last = [...messages].reverse().find(m => m.role === 'assistant')
    if (!last) return
    await axios.post(`${API}/notes`, { title: 'Saved Note', content: last.content })
    alert('Saved to Notes')
  }

  return (
    <div className="card">
      <h2>LearnChat</h2>
      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
      </div>

      <div className="row">
        <button onClick={() => send('Summarize simply with bullet points')}>Summarize</button>
        <button onClick={() => send('Explain simply like I am a student')}>Explain simply</button>
      </div>

      <div className="row">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={saveLast}>Save Notes</button>
      </div>

      <div className="row">
        <textarea
          className="textarea"
          rows={3}
          placeholder="Ask anything or paste notes here..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="primary" onClick={() => send()} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
