import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import Issues from './Pages/Issues/Issues'
import Phase from './Pages/Phases/Phase'
import Tasks from './Pages/Tasks/Tasks'
import Projects from './Pages/Projects/Projects'
import Dashboard from './Pages/Dashboard/Dashboard'

function App() {

  return (
    <>
      <Routes>

        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path='issues' element={<Issues />} />
          <Route path='phases' element={<Phase />} />
          <Route path='tasks' element={<Tasks />} />
          <Route path='projects' element={<Projects />} />
        </Route>


      </Routes>
    </>
  )
}

export default App
