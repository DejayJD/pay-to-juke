import { useState } from 'react'
import App from './App'

// NOTE: This is so the user can interact with the page before we start audio. #jank #hackathon #idgaf
export const BeforeApp = () => {
  const [userInteract, setUserInteract] = useState(false)

  return userInteract ? <App /> : (
    <button onClick={() => setUserInteract(true)}>lets go</button>
  )
}
