import RoomIcon from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRef, useState,useEffect } from 'react';
import "./register.css";
import axios from 'axios';

const Register=({setShowRegister})=> {
    const[success, setSuccess] = useState(false);
    const[failed, setFailed] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e)=>{
      e.preventDefault();
      const newUser = {
        username:nameRef.current.value,
        email:emailRef.current.value,
        password:passwordRef.current.value,
      }
      
      try{
       await axios.post("http://localhost:8000/api/users/register", newUser)
       setSuccess(true);

      }catch(err){
        setFailed(true)
      }

    }


  return (
    <div className="registercontainer">
        <div className="logo">
            <RoomIcon/>
            WORLDMAP-PIN
        </div>
        <form onSubmit={handleSubmit} >
            <input type="text" placeholder="username" ref={nameRef} />
            <input type="email" placeholder="email" ref={emailRef} />
            <input type="password" placeholder="password" ref={passwordRef} />
            <button >Register</button>
            <div>
            {success && 
            <p className='success'>Successfull! You can login now.</p> }
            { failed &&
            <p className='failed'>Failed! something went wrong.</p> }
            </div>
        </form>
        <CancelIcon onClick={()=>setShowRegister(false)} className='registerCancel'/>
    </div>
  )
}

export default Register;