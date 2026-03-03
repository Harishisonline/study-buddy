import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'https://study-buddy-backend-docker.onrender.com'

export default function Syllabus() {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    axios.get(`${API}/syllabus`).then(res => setContent(res.data.content || '')).catch(() => {})
  }, [])

  const saveText = async () => {
    setStatus('Saving...')
    await axios.post(`${API}/syllabus`, { content })
    setStatus('Saved!')
  }

  const saveFile = async () => {
    if (!file) return
    setStatus('Uploading...')
    const form = new FormData()
    form.append('file', file)
    await axios.post(`${API}/syllabus/file`, form)
    setStatus('Saved from file!')
  }

  return (
    <div className="card">
      <h2>My Syllabus</h2>
      <p>Upload your syllabus to get personalized answers.</p>

      <textarea
        className="textarea"
        rows={10}
        placeholder="Paste your syllabus or key topics here..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="row">
        <button className="primary" onClick={saveText}>Save Syllabus</button>
        <span className="muted">or upload file</span>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={saveFile}>Upload File</button>
      </div>
      {status && <div className="muted">{status}</div>}
    </div>
  )
}
