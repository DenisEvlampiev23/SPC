import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ButtonText } from '../components/ButtonText';
import { motion, useAnimationControls } from 'framer-motion';
import { useNavigate } from 'react-router';

export const Registration = () => {
  const navigate = useNavigate();

  const textAnimate = useAnimationControls();
  const fieldAnimate = useAnimationControls();
  const textLeftAnimate = useAnimationControls();
  const textRightAnimate = useAnimationControls();
  const switchAnimate = useAnimationControls();

  const [nameText, setNameText] = useState('');
  const [passwordText1, setPasswordText1] = useState('');
  const [passwordText2, setPasswordText2] = useState('');

  const [borderName, setBorderName] = useState(false);
  const [borderPassword, setBorderPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function register(){
    if(passwordText1.length < 7 || passwordText2.length < 7){
      textAnimate.start({color: '#FA6868', scale: 1.05}).then(() => textAnimate.start({color: '#6C6C6C', scale: 1}));
    } else if(passwordText1 !== passwordText2){
      fieldAnimate.start({color: '#FA6868', scale: 1.05, y: 0}).then(() => fieldAnimate.start({color: '#6C6C6C', scale: 1, y: 0}));
    } else {
      //register
    }
  }

  return (
    <div className='xs:bg-back w-screen h-screen grid justify-items-center'>
      <div className='my-auto sm:m-auto px-6 py-12 rounded-xl bg-white xs:shadow-lg'>
        <Logo className='mt-2'/>

        {/*Inputs*/}
        <div className='mt-24 grid justify-items-center'>
          <motion.input 
            animate={{ borderColor: borderName ? '#4355FF' : '#E8E8E8'}} 
            onFocus={() => {setBorderName(true)}} onBlur={() => {
              setBorderName(false);
              setShowPassword(true);
            }} 
            whileTap={{scale: 0.98}}
            onChange={e => setNameText(e.target.value)}
            placeholder='Имя Фамилия' 
            autoCapitalize='name' 
            autoComplete='off' 
            className="w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />

          <motion.input 
            initial={{
              opacity: 0.3,
            }}
            animate={{ 
              borderColor: borderPassword ? '#4355FF' : '#E8E8E8', 
              opacity: nameText.length > 0 && showPassword ? 1 : 0.4,
            }} 
            whileTap={{scale: 0.98}}
            layout
            onFocus={() => {setBorderPassword(true)}} 
            onBlur={() => setBorderPassword(false)} 
            onChange={e => {setPasswordText1(e.target.value)}}
            placeholder='Пароль' 
            type='password' 
            autoComplete='off' 
            className="mt-5 w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" 
            />
            <motion.div animate={fieldAnimate}>

            <motion.input 
            initial={{
              opacity: 0.3,
            }}
            animate={{ 
              borderColor: borderPassword ? '#4355FF' : '#E8E8E8', 
              opacity: nameText.length > 0 && showPassword ? 1 : 0.3,
            }} 
            whileTap={{scale: 0.98}}
            layout
            onFocus={() => {setBorderPassword(true)}} 
            onBlur={() => setBorderPassword(false)} 
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
