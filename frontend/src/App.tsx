import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';

import BulkBlogs from './pages/BulkBlogs';
import Blog from './pages/Blog';
import Publish from './pages/Publish';
import Home from './pages/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/blogs' element={<BulkBlogs />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route path='publish' element={<Publish />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
