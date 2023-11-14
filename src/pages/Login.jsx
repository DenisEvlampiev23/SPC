import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ButtonHollow } from '../components/ButtonHollow';
import { ButtonText } from '../components/ButtonText';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

export const Login = () => {
  const navigate = useNavigate();

  const [nameText, setNameText] = useState('');

  const [borderName, setBorderName] = useState(false);
  const [borderPassword, setBorderPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
              opacity: nameText.length > 0 && showPassword ? 1 : 0.3,
            }} 
            whileTap={{scale: 0.98}}
            layout
            onFocus={() => {setBorderPassword(true)}} 
            onBlur={() => setBorderPassword(false)} 
            placeholder='Пароль' 
            type='password' 
            autoComplete='off' 
            className="mt-3 w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" 
            />
        </div>
        
        {/*Buttons*/}
        <div className='mt-8 grid justify-items-center'>
            <Button text='Войти'/>
            <ButtonHollow text='Регистрация' onClick={() => {navigate('/registration')}} className="mt-3"/>
            <ButtonText text='Что это?' onClick={() => navigate('/about')} className="mt-3"/>
        </div>
      </div>
    </div>
  )
}
