import { useState } from 'react'
import UserAuth from '../components/UserAuth'
import Auth from '../components/Auth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Auth />
    </>
  )
}

export default App
