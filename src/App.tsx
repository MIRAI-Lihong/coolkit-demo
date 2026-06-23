import {RouterProvider} from 'react-router-dom'
import {router} from '@/router'
import {client} from '@/websocket/client'
import {useEffect} from 'react'

function App() {
  useEffect(() => {
    client.connect()

    return () => {
      client.disconnect()
    }
  }, [])
  return <RouterProvider router={router} />
}

export default App
