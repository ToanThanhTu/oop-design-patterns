import './App.css'
import { Route, Routes } from 'react-router'
import About from '@/containers/About'

function App() {
  return (
    <>
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>
      <h1 className="">Hello World</h1>
    </>
  )
}

export default App
