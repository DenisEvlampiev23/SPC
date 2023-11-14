import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ButtonText } from '../components/ButtonText';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

export const EnterRoom = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('');

  const [borderName, setBorderName] = useState(false);

  function enterRoom(){
    navigate('/lesson');
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
            }} 
            whileTap={{scale: 0.98}}
            onChange={e => setCode(e.target.value)}
            placeholder='Код комнаты' 
            autoCapitalize='name' 
            autoComplete='off' 
            className="w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />
        </div>
        
        {/*Buttons*/}
        <div className='mt-8 grid justify-items-center'>
            <Button text='Зайти' onClick={enterRoom} className='w-80'/>
            <ButtonText text='Что это?' onClick={() => navigate('/about')} className="mt-3"/>
        </div>
      </div>
    </div>
  )
}
