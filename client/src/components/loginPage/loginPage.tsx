import React, { useState } from 'react';
import './loginPage.css';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../../firebase';

const LoginPage: React.FC = () => {
  const initialFormState = {
    email: '',
    password: ''
  }
  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({...prevState, [e.target.name]: e.target.value}));
  }

  const handleLogin = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formState.email, formState.password);
      if (auth.currentUser) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setError('The email or password you entered was incorrect.');
    }
  }

  return (
    <div className='login-page-container'>
      <div className='login-form-container'>
        <h1>Sign In</h1>
        <form className='login-form' onSubmit={handleLogin}>
          <input className='login-input'
            type='text'
            placeholder='Email...'
            name='email'
            value={formState.email}
            onChange={handleInputChange}
          />
          <input className='login-input'
            type='password'
            placeholder='Password...'
            name='password'
            value={formState.password}
            onChange={handleInputChange}
          />
          <button className='submit-btn' id='green-btn' type='submit'>Sign In</button>
        </form>
        {error && <p id="login-form-error">{error}</p>}
      </div>
    </div>
  )
}

export default LoginPage;