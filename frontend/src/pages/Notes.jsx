import { useEffect, useState } from 'react'
import axios from 'axios'
import { jsPDF } from 'jspdf'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [active, setActive] = useState(null)

  const load = async () => {
    const res = await axios.get(`${API}/notes`)
    setNotes(res.data)
    if (res.data.length && !active) setActive(res.data[0])
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    await axios.put(`${API}/notes/${active.id}`, { title: active.title, content: active.content })
    alert('Saved')
    load()
  }

  const remove = async (id) => {
    await axios.delete(`${API}/notes/${id}`)
    setActive(null)
    load()
  }

  const exportPDF = () => {
    if (!active) return
    const doc = new jsPDF()
    doc.text(active.title, 10, 10)
    const lines = doc.splitTextToSize(active.content, 180)
    doc.text(lines, 10, 20)
    doc.save(`${active.title}.pdf`)
  }

  return (
    <div className="notes">
      <div className="sidebar">
        <h3>My Notes</h3>
        {notes.map(n => (
          <div key={n.id} className={`note-item ${active?.id === n.id ? 'active' : ''}`} onClick={() => setActive(n)}>
            {n.title}
          </div>
        ))}
      </div>
      <div className="canvas">
        {active ? (
          <>
            <div className="canvas-header">
              <input
                className="title"
                value={active.title}
                onChange={e => setActive({ ...active, title: e.target.value })}
              />
              <div className="row">
                <button onClick={exportPDF}>Download PDF</button>
                <button onClick={save} className="primary">Save</button>
                <button onClick={() => remove(active.id)} className="danger">Delete</button>
              </div>
            </div>
            <textarea
              className="canvas-body"
              value={active.content}
              onChange={e => setActive({ ...active, content: e.target.value })}
            />
          </>
        ) : (
          <div className="muted">Select a note to view/edit</div>
        )}
      </div>
    </div>
  )
}
