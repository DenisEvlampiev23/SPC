import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About } from './pages/About';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { EnterRoom } from './pages/EnterRoom';
import { CreateRoom } from './pages/CreateRoom';
import { Room } from './pages/Room';
import server from './server';

function App() {
  server.userCredentials = sessionStorage.getItem('userCredentials');
  server.refUser = sessionStorage.getItem('refUser');
  server.isUserTeacher = sessionStorage.getItem('isUserTeacher');

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />}/>
          <Route path='/registration' element={<Registration />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/enterRoom' element={<EnterRoom />}/>
          <Route path='/createRoom' element={<CreateRoom />}/>
          <Route path='/lesson' element={<Room />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
