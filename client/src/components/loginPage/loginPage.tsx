import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../../firebase';
import './loginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        navigate('/dashboard');
        console.log('Successfully logged in');
      }
    } catch (error: any) {
      setError('The email or password you entered was incorrect.');
    }
  }


  return (
    <div className='login-page-container'>
      <div className='login-form-container'>
        <h1>Login</h1>
        <form className='login-form' onSubmit={handleLogin}>
          <input type='text' value={email} onChange={event => setEmail(event.target.value)} placeholder='Email...'></input>
          <input type='password' value={password} onChange={event => setPassword(event.target.value)} placeholder='Password...'></input>
          <button type='submit' className='sign-in-btn'>Log In</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  )
}



export default LoginPage;