import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About } from './pages/About';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { EnterRoom } from './pages/EnterRoom';
import { CreateRoom } from './pages/CreateRoom';
import { Room } from './pages/Room';
import { CreateMaterial } from './pages/CreateMaterial';
import { ViewMaterial } from './pages/ViewMaterial';
import server from './server';

function App() {
  const updateValues = async () => {
    server.userCredentials = sessionStorage.getItem('userCredentials');
    server.refUser = sessionStorage.getItem('refUser');
    server.isUserTeacher = sessionStorage.getItem('isUserTeacher');
    server.userName = sessionStorage.getItem('userName');
    server.activeRoomCode = sessionStorage.getItem('activeRoomCode');
    server.refActiveRoom = sessionStorage.getItem('refActiveRoom');
    server.roomData = sessionStorage.getItem('roomData');
    server.uid = sessionStorage.getItem('uid');
  }

  updateValues();

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
          <Route path='/createMaterial' element={<CreateMaterial />}/>
          <Route path='/viewMaterial' element={<ViewMaterial />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
