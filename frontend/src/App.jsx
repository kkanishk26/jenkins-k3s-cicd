import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.64.9:30081'

function App() {
  const [message, setMessage] = useState('loading...')

  useEffect(() => {
    fetch(`${API_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => setMessage(`${data.message} (v${data.version})`))
      .catch(() => setMessage('Could not reach backend'))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Jenkins to K3s CI/CD Demo</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
