
import './App.css'
import Todo from './Todo'
import Login from './Login'
import Signup from './Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Todo" element={<Todo />}></Route>
        </Routes>
      </BrowserRouter>
      
    </>
  )

}

export default App
