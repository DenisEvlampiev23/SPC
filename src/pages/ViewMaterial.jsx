import React, { useEffect, useRef, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonText } from '../components/ButtonText';
import { useLocation, useNavigate } from 'react-router-dom';

export const ViewMaterial = () => {
    const navigate = useNavigate();
    const state = useLocation();

    const [material, setMaterial] = useState({title: 'Nothing here...'});
    
    useEffect(() => {
        setMaterial(state.state.material);
    });

    return (
        <div className='w-screen grid justify-items-center'>
            <div className='absolute bg-back w-full h-full -z-10'/>

            <div className='mt-8 w-screen h-screen px-3 flex flex-col xs:items-center'>
                <div>
                    <ButtonText text='Назад' onClick={() => {navigate('/lesson')}} className="inline-block"/>

                    <Card text='' className='mt-5 xs:w-80'>
                        <p className="text-black text-3xl font-semibold font-montserrat">{material.title}</p>

                        {
                            material.image !== null && material.image !== undefined && material.image !== ''
                            ? <img src={material.image} className='mt-3 rounded-xl w-full'/>
                            : <></>
                        }

                        <div className="text-stone-900 text-base font-normal mt-5 font-montserrat">{material.description}</div>
                        <Button text='Закрыть' onClick={() => {navigate('/lesson')}} className='mt-5'/>
                    </Card>
                </div>
            </div>
        </div>
    )
}