import RoomIcon from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRef, useState } from 'react';
import "./login.css";
import axios from 'axios';

const Login = ({setShowLogin, myStorage, setCurrentUser})=> {
    const[failed, setFailed] =useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e)=>{
      e.preventDefault();
      const user = {
        username:nameRef.current.value,
        password:passwordRef.current.value,
      }
      
      try{
       const res = await axios.post("http://localhost:8000/api/users/login", user)
       myStorage.setItem("user", res.data.username);
       setCurrentUser(res.data.username);
       setShowLogin(false);
      }catch(err){
        setFailed(true)
      }

    }

  return (
    <div className="logincontainer">
        <div className="logo">
            <RoomIcon/>
            WORLDMAP-PIN
        </div>
        <form onSubmit={handleSubmit} >
            <input type="text" placeholder="username" ref={nameRef} />
            <input type="password" placeholder="password" ref={passwordRef} />
            <button >Login</button>
            <div>
            { failed &&
            <p className='failed'>Failed! something went wrong.</p> }
            </div>
        </form>
        <CancelIcon onClick={()=>setShowLogin(false)} className='loginCancel'/>
    </div>
  )
}

export default Login;