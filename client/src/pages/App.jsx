import { useState } from 'react'
import UserAuth from '../components/UserAuth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserAuth />
    </>
  )
}

export default App
