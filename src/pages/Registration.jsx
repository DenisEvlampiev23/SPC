import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ButtonText } from '../components/ButtonText';
import { motion, useAnimationControls } from 'framer-motion';
import { useNavigate } from 'react-router';
import server from '../server';
import { AuthErrorCodes } from 'firebase/auth';

export const Registration = () => {
  const navigate = useNavigate();

  const textAnimate = useAnimationControls();
  const fieldAnimate = useAnimationControls();
  const nameAnimate = useAnimationControls();
  const emailAnimate = useAnimationControls();
  const textLeftAnimate = useAnimationControls();
  const textRightAnimate = useAnimationControls();
  const switchAnimate = useAnimationControls();
  const errorAnimate = useAnimationControls();

  const [nameText, setNameText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passwordText1, setPasswordText1] = useState('');
  const [passwordText2, setPasswordText2] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function register(){
    if (nameText.length <= 0){
      nameAnimate.start({color: '#FA6868', scale: 1.05, y: 0}).then(() => nameAnimate.start({color: '#6C6C6C', scale: 1, y: 0}));
      return
    } else if (emailText.length <= 0){
      emailAnimate.start({color: '#FA6868', scale: 1.05, y: 0}).then(() => emailAnimate.start({color: '#6C6C6C', scale: 1, y: 0}));
      return;
    } else if(passwordText1.length < 7 || passwordText2.length < 7){
      textAnimate.start({color: '#FA6868', scale: 1.05}).then(() => textAnimate.start({color: '#6C6C6C', scale: 1}));
      return;
    } else if(passwordText1 !== passwordText2){
      fieldAnimate.start({color: '#FA6868', scale: 1.05, y: 0}).then(() => fieldAnimate.start({color: '#6C6C6C', scale: 1, y: 0}));
      return;
    } else if (emailText.length <= 0){
      emailAnimate.start({color: '#FA6868', scale: 1.05, y: 0}).then(() => fieldAnimate.start({color: '#6C6C6C', scale: 1, y: 0}));
      return;
    }
      
    const responce = await server.signUpEmail(emailText, passwordText1, nameText, isTeacher);

    switch(responce){
      case 'OK':
        server.isUserTeacher === true
        ? navigate('/createRoom')
        : navigate('/enterRoom');
      break;
      
      case AuthErrorCodes.INVALID_EMAIL:
        setErrorText('Неправильно введена почта');
        errorAnimate.start({x: 0, opacity: 1}).then(setTimeout(() => {errorAnimate.start({x: 50, opacity: 0})}, 2000));
      break;

      case AuthErrorCodes.EMAIL_EXISTS:
        setErrorText('Эта почта уже используется');
        errorAnimate.start({x: 0, opacity: 1}).then(setTimeout(() => {errorAnimate.start({x: 50, opacity: 0})}, 2000));
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
              animate={errorAnimate}
              className="text-center text-neutral-500 text-sm mt-1 mb-2 font-normal font-montserrat">
                {errorText}</motion.div>

          <motion.input 
            animate={nameAnimate}
            whileFocus={{borderColor: '#4355FF'}}
            whileTap={{scale: 0.98}}
            onChange={e => setNameText(e.target.value)}
            placeholder='Имя Фамилия' 
            autoCapitalize='name' 
            autoComplete='off' 
            className="w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />

          <motion.input 
            animate={emailAnimate}
            whileTap={{scale: 0.98}}
            whileFocus={{borderColor: '#4355FF'}}
            onBlur={() => {setShowPassword(true)}}
            onChange={e => setEmailText(e.target.value)}
            placeholder='Электронная почта' 
            type='email'
            className="w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg mt-5"/>

          <motion.input 
            initial={{
              opacity: 0.3,
            }}
            animate={{ 
              opacity: emailText.length > 0 && showPassword ? 1 : 0.4,
            }} 
            whileFocus={{borderColor: '#4355FF'}}
            whileTap={{scale: 0.98}}
            layout
            onChange={e => {setPasswordText1(e.target.value)}}
            placeholder='Пароль' 
            type='password' 
            autoComplete='off' 
            className="mt-3 w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" 
            />
            <motion.div animate={fieldAnimate}>

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
            onChange={e => {setPasswordText2(e.target.value)}}
            placeholder='Повторите пароль' 
            type='password' 
            autoComplete='off' 
            className="mt-3 w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" 
            />
            </motion.div>

          <motion.div 
            animate={textAnimate}
            className="text-center text-neutral-500 text-sm mt-1 font-normal font-montserrat">
              Пароль должен быть не менее 7 символов</motion.div>
        </div>

        {/*Switch*/}
        <div className='w-80 h-11 mt-5 rounded-3xl border border-brand flex justify-around relative'>
          <motion.div 
            className="my-auto w-1/2 h-full flex justify-center items-center cursor-default select-none text-white text-lg z-20 font-medium font-montserrat"
            animate={textLeftAnimate}
            onClick={() => {
              setIsTeacher(false);
              switchAnimate.start({left: '0%'});
              textLeftAnimate.start({color: '#FFFFFF'})
              textRightAnimate.start({color: '#1E1E1E'});
            }}
            whileTap={{scale: 0.95}}
            >Ученик</motion.div>
          <motion.div 
            className="my-auto w-1/2 h-full flex justify-center cursor-default items-center select-none text-stone-900 text-lg z-20 font-medium font-montserrat"
            animate={textRightAnimate}
            onClick={() => {
              setIsTeacher(true);
              switchAnimate.start({left: '50%'});
              textRightAnimate.start({color: '#FFFFFF'})
              textLeftAnimate.start({color: '#1E1E1E'});
            }}
            whileTap={{scale: 1.05}}
            >Учитель</motion.div>
          <motion.div 
            initial={{left: '0%'}} 
            animate={switchAnimate}
            className='w-40 h-full rounded-3xl overflow-hidden z-1 absolute bg-brand shadow-md'/>
        </div>
        
        {/*Buttons*/}
        <div className='mt-8 grid justify-items-center'>
            <Button text='Зарегестрироваться' onClick={register} className='w-80'/>
            <ButtonText text='У меня есть аккаунт' onClick={() => {navigate('/')}} className="mt-3"/>
            <ButtonText text='Что это?' onClick={() => navigate('/about')} className="mt-3"/>
        </div>
      </div>
    </div>
  )
}
