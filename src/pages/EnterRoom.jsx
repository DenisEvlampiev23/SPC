import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ButtonText } from '../components/ButtonText';
import { motion, useAnimationControls } from 'framer-motion';
import { useNavigate } from 'react-router';
import server from '../server';

export const EnterRoom = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const inputAnimate = useAnimationControls();
  const textAnimate = useAnimationControls();

  async function joinRoom(){
    if(code === ''){
      inputAnimate.start({borderColor: '#FA6868', scale: 1.05}).then(() => inputAnimate.start({borderColor: '#e5e7eb', scale: 1}));
      return;
    }

    const responce = await server.joinRoom(code.trim().toLowerCase().replace('.', '').replace('/', ''));

    if(responce === 'OK'){
      navigate('/lesson');
    } else {
      textAnimate.start({x: 0, opacity: 1}).then(setTimeout(() => {textAnimate.start({x: 65, opacity: 0})}, 2000));
    }
  }

  return (
    <div className='xs:bg-back w-screen h-screen grid justify-items-center'>
      <div className='my-auto sm:m-auto px-6 py-12 rounded-xl bg-white xs:shadow-lg'>
        <Logo className='mt-2'/>

        {/*Inputs*/}
        <div className='mt-24 grid justify-items-center'>
          <motion.div 
            initial={{opacity: 0, x: -65}}
            animate={textAnimate}
            className="text-center text-neutral-500 text-sm mt-1 mb-2 font-normal font-montserrat">
              Этот код нигде не используется</motion.div>
              
            <motion.input 
            animate={inputAnimate}
            whileFocus={{ borderColor: '#4355FF'}} 
            whileTap={{scale: 0.98}}
            onChange={e => setCode(e.target.value)}
            placeholder='Код комнаты' 
            autoCapitalize='name' 
            autoComplete='off' 
            className="w-80 h-12 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />
        </div>
        
        {/*Buttons*/}
        <div className='mt-8 grid justify-items-center'>
            <Button text='Зайти' onClick={joinRoom} className='w-80'/>
            <ButtonText text='Что это?' onClick={() => navigate('/about')} className="mt-3"/>
        </div>
      </div>
    </div>
  )
}
