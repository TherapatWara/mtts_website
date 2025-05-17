import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './loginpage.css'
import Navbar from '../navbar/navbarindex';

export default function Loginpage() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlelogin = async () =>{
        if(user === "mtts" & password === "@Passw0rdmtts"){
                localStorage.setItem('loggedIn', 'true');
                navigate('/selectionpage');
        }
        else{
            alert("Invalid username or password!!");
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlelogin();
        }
    };

  return (
    <div>
        <Navbar />
        <div className='login-body'>
            
            <div className='login-fill'>
                <h1>Sign in</h1>
                <div className='input-zone'>
                    <input placeholder='  User name' autoComplete="on" value={user} onChange={(e) => setUser(e.target.value)}></input>
                    <input placeholder='  Password' autoComplete="on"  value={password} onChange={(e) => setPassword(e.target.value) } onkeydown={handleKeyDown}></input>
                </div>
                <button onClick={handlelogin}>Sign in</button>
            </div>
        </div>

    </div>
  )
}
