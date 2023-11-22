import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonHollow } from '../components/ButtonHollow'
import { ButtonText } from '../components/ButtonText';
import server from '../server';
import { useNavigate } from 'react-router-dom';

export const Room = () => {
    const navigate = useNavigate();

    const [roomCode, setRoomCode] = useState('Room Code');
    const [tests, setTests] = useState([]);
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        setRoomCode(server.activeRoomCode);

        server.subscribeOnRoomChanges((data) => {
            if(data.tests !== null && data.tests !== undefined){
                sessionStorage.setItem('tests', data.tests);
                sessionStorage.setItem('materials', data.materials);
            }

            setRoomCode(data.code);
            setTests(data.tests);
            setMaterials(data.materials)
            setMaterials(data.materials);
        });
    }, []);

    const quitRoom = async () => {
        if(server.isUserTeacher === 'true'){
            await server.dissolveRoom();
            navigate('/createRoom');
        } else {
            navigate('/enterRoom');
        }
    }

    return (
        <div className='w-screen grid justify-items-center'>
            <div className='absolute bg-back w-full h-full -z-10'/>
            <div className='mt-8 w-screen h-full pl-3 flex flex-col'>
                <div>
                    <p className="text-black text-4xl font-semibold font-montserrat mb-5">Тесты</p>

                    <div className='col-auto flex-wrap flex overflow-x-auto w-full'>
                        {
                            tests !== undefined
                            ? tests.map((test) => {
                                return <Card className='xs:w-80' key={test.title} text={test.title}>
                                    {
                                        server.isUserTeacher === 'true'
                                        ? <>
                                            <Button text='Редактировать' className='mt-5'/>
                                            <ButtonHollow text='Убрать' color='#FA6868' className='mt-3'/>
                                        </> : <>
                                            {
                                                test !== undefined && test !== null && server.userName !== null && test.usersCompleted !== undefined
                                                ? test.usersCompleted.find(server.userName) === undefined
                                                    ? <Button text='Начать' className='mt-5'/>
                                                    : <ButtonHollow text='Ещё раз' className='mt-5'/>
                                                : <Button text='Начать' className='mt-5'/>
                                            }
                                        </>
                                    }
                                </Card>
                            }) : <></>
                        }
                    </div>

                    {
                        server.isUserTeacher === 'true'
                        ? <ButtonText text='Добавить тест' className='mt-5 xs:inline-block'/>
                        : <></>
                    }
                </div>

                <div className='mt-8'>
                    <motion.div layout className="text-black text-4xl font-semibold font-montserrat mb-5 z-30">Материалы</motion.div>
                    <div className='md:flex flex-row col-auto flex-wrap flex overflow-x-auto w-full'>
                        {
                            materials !== undefined
                            ? materials.map((material) => {
                                return <Card className='xs:w-80' text={material.title} key={material.title}>
                                    {
                                        server.isUserTeacher === 'true'
                                        ? <>
                                            <Button text='Редактировать' className='mt-5'/>
                                            <ButtonHollow text='Убрать' color='#DF0000' className='mt-3'/>
                                        </>
                                        : <>
                                            <Button text='Посмотреть' className='mt-5'/>
                                        </>
                                    }
                                </Card>
                            }) : <></>
                        }
                        
                    </div>

                    {
                        server.isUserTeacher === 'true'
                        ? <ButtonText text='Добавить материал' onClick={() => {navigate('/createMaterial')}} className='mt-5 xs:inline-block'/>
                        : <></>
                    }
                </div>

                <div className='h-full flex flex-col pb-8'>
                    <div className='mt-auto mb-8 flex flex-col items-center'>
                        <p className="text-neutral-500 text-base font-normal font-montserrat">{roomCode}</p>
                        <ButtonText text='Выйти из комнаты' onClick={quitRoom} className='mt-3'/>
                    </div>
                </div>
            </div>
        </div>
    )
}