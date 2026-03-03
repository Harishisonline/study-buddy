import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Syllabus from './pages/Syllabus'
import LearnChat from './pages/LearnChat'
import Notes from './pages/Notes'
import './App.css'

function Layout({ children }) {
  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">Study Buddy</div>
        <div className="links">
          <Link to="/">Dashboard</Link>
          <Link to="/syllabus">My Syllabus</Link>
          <Link to="/learnchat">LearnChat</Link>
          <Link to="/notes">Notes</Link>
        </div>
      </nav>
      <main className="main">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/learnchat" element={<LearnChat />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
