import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="card">
      <h1>Welcome to Study Buddy</h1>
      <p>Your personal study companion for quick, simple, and clear notes.</p>
      <Link className="primary" to="/syllabus">Go to My Syllabus →</Link>
    </div>
  )
}
