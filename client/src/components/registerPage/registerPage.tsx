import React, { useState } from 'react';
import './registerPage.css';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../../firebase';
import { registerUser } from '../../services/userService';

const RegisterPage: React.FC = () => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }
  const [formState, setFormState] = useState(initialFormState);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({...prevState, [e.target.name]: e.target.value}));
  }

  const resetForm = () => {
    setFormState(initialFormState);
  }

  const handleRegister = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, formState.email, formState.password);
    } catch (error) {
      console.error(error);
    }

    const formData = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
    };

    try {
      await registerUser(formData);
      resetForm();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }

  const handleSignIn = () => {
    navigate('/login');
  }

  return (
    <div className='register-page-container'>
      <div className='register-form-container'>
        <h1>Register</h1>
        <form className='register-form' onSubmit={handleRegister}>
          <input className='register-input'
            type='text'
            placeholder='First Name'
            name='firstName'
            value={formState.firstName}
            onChange={handleInputChange}
          />
          <input className='register-input'
            type='text'
            placeholder='Last Name'
            name='lastName'
            value={formState.lastName}
            onChange={handleInputChange}
          />
          <input className='register-input'
            type='text'
            placeholder='Email'
            name='email'
            value={formState.email}
            onChange={handleInputChange}
          />
          <input className='register-input'
            type='password'
            placeholder='Password'
            name='password'
            value={formState.password}
            onChange={handleInputChange}
          />
          <button className='submit-btn' id='green-btn' type='submit'>Register</button>
        </form>
        <p>Already have an account?</p>
        <button className='submit-btn' id='grey-btn' onClick={handleSignIn}>Sign In</button>
      </div>
    </div>
  )
}

export default RegisterPage;
