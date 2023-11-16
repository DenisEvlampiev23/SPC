import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ButtonHollow } from '../components/ButtonHollow';
import { ButtonText } from '../components/ButtonText';
import { motion, useAnimationControls } from 'framer-motion';
import { useNavigate } from 'react-router';
import server from '../server';
import { AuthErrorCodes } from 'firebase/auth';

export const Login = () => {
  const navigate = useNavigate();

  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [errorText, setErrorText] = useState('Что-то пошло не так');

  const emailAnimate = useAnimationControls();
  const passwordAnimate = useAnimationControls();
  const textAnimate = useAnimationControls();

  const [showPassword, setShowPassword] = useState(false);

  async function login(){
    if(emailText.length <= 0){
      emailAnimate.start({color: '#FA6868', scale: 1.05, y: 0}).then(() => emailAnimate.start({color: '#6C6C6C', scale: 1, y: 0}));
      return;
    } else if(passwordText.length <= 0){
      passwordAnimate.start({color: '#FA6868', scale: 1.05, y: 0}).then(() => passwordAnimate.start({color: '#6C6C6C', scale: 1, y: 0}));
      return;
    }

    const responce = await server.logInEmail(emailText, passwordText);

    //login
    switch(responce){
      case 'OK':
        server.isUserTeacher === true
        ? navigate('/createRoom')
        : navigate('/enterRoom');
      break;
      
      case AuthErrorCodes.INVALID_EMAIL:
        setErrorText('Неправильный адрес электронной почты');
        textAnimate.start({x: 0, opacity: 1}).then(setTimeout(() => {textAnimate.start({x: 50, opacity: 0})}, 3000));
      break;

      case AuthErrorCodes.INVALID_PASSWORD:
        setErrorText('Неправильный пароль');
        textAnimate.start({x: 0, opacity: 1}).then(setTimeout(() => {textAnimate.start({x: 50, opacity: 0})}, 3000));
      break;

      case 'auth/invalid-login-credentials':
        setErrorText('Почта или пароль введены неверно');
        textAnimate.start({x: 0, opacity: 1}).then(setTimeout(() => {textAnimate.start({x: 50, opacity: 0})}, 4000));
      break;
    }
  }

  return (
    <div className='xs:bg-back w-screen h-screen grid justify-items-center'>
      <div className='my-auto sm:m-auto px-6 py-12 rounded-xl bg-white xs:shadow-lg'>
        <Logo className='mt-2'/>

        {/*Inputs*/}
        <div className='mt-24 grid justify-items-center'>
          <motion.div 
              initial={{opacity: 0, x: -50}}
              animate={textAnimate}
              className="text-center text-neutral-500 text-sm mt-1 mb-2 font-normal font-montserrat">
                {errorText}</motion.div>

          <motion.div animate={emailAnimate}>
            <motion.input 
              onBlur={() => {
                setShowPassword(true);
              }} 
              whileTap={{scale: 0.98}}
              onChange={e => setEmailText(e.target.value)}
              placeholder='Электронная почта' 
              autoCapitalize='name' 
              autoComplete='off' 
              className="w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />
          </motion.div>

          <motion.div animate={passwordAnimate}>
              <motion.input
                initial={{
                  opacity: 0.3,
                }}
                animate={{ 
                  opacity: emailText.length > 0 && showPassword ? 1 : 0.3,
                }} 
                whileFocus={{borderColor: '#4355FF'}}
                whileTap={{scale: 0.98}}
                layout
                onChange={e => setPasswordText(e.target.value)}
                placeholder='Пароль' 
                type='password' 
                autoComplete='off' 
                className="mt-3 w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" 
                />
          </motion.div>
        
        {/*Buttons*/}
        <div className='mt-8 grid justify-items-center'>
            <Button text='Войти' onClick={login} className='w-80'/>
            <ButtonHollow text='Регистрация' onClick={() => {navigate('/registration')}} className="mt-3 w-80"/>
            <ButtonText text='Что это?' onClick={() => navigate('/about')} className="mt-3"/>
        </div>
      </div>
    </div>
    </div>
  )
}
