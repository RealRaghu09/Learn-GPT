import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx'
import NotFound from './components/NotFound.jsx'
import {createBrowserRouter , Router, RouterProvider} from 'react-router-dom'
const router  = createBrowserRouter([
  {path: '/' , element: <Home/>},
  {path: '/upload_pdf' , element: <App/>},
  {path: '*' , element: <NotFound/>}
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
);
