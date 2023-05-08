import React, { useState } from 'react';
import './registerPage.css';
import { RegisterForm, initialRegisterFormState } from '../../interfaces/registerFormInterface';
import { auth, createUserWithEmailAndPassword } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  }

  const handleSubmitForm = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
    } catch (error) {
      console.error(error);
    }

    const formData = {
      firstName,
      lastName,
      email
    };
    fetch('http://localhost:3001/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        resetForm();
        navigate('/login');
      })
      .catch(error => console.error(error));
  }

  const handleSignIn = () => {
    navigate('/login');
  }

  return (
    <div className='register-page-container'>
      <div className='register-form-container'>
        <h1>Register</h1>
        <form onSubmit={handleSubmitForm} className='register-form'>
          <input type='text' value={firstName} onChange={event => setFirstName(event.target.value)}  placeholder='First Name' className='register-input' ></input>
          <input type='text' value={lastName} onChange={event => setLastName(event.target.value)}  placeholder='Last Name' className='register-input'></input>
          <input type='text' value={email} onChange={event => setEmail(event.target.value)}  placeholder='Email' className='register-input'></input>
          <input type='password' value={password} onChange={event => setPassword(event.target.value)}  placeholder='password' className='register-input'></input>
          <button type='submit' className='register-btn'>Register</button>
        </form>
        <p>Already have an account?</p>
        <button className='sign-in-btn' onClick={handleSignIn}>Sign In</button>
      </div>

    </div>
  )
}




export default RegisterPage;