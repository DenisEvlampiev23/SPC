import React, { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonHollow } from '../components/ButtonHollow'
import { ButtonText } from '../components/ButtonText';
import server from '../server';
import { useNavigate } from 'react-router-dom';

export const Room = () => {
    const navigate = useNavigate();

    const isUserTeacher = server.isUserTeacher;

  return (
    <div className='w-screen grid justify-items-center'>
        <div className='absolute bg-back w-full h-full -z-10'/>
        <div className='mt-8 w-screen h-full pl-3 flex flex-col'>
            <div>
                <p className="text-black text-4xl font-semibold font-montserrat mb-5">Тесты</p>

                <div className='col-auto flex-wrap flex overflow-x-auto w-full'>
                    <Card text='Параграф 8. Политическая карта средневековой Европы'>
                        {
                            isUserTeacher
                            ? <>
                                <Button text='Редактировать' className='mt-5'/>
                                <ButtonHollow text='Убрать' color='#DF0000' className='mt-3'/>
                            </>
                            : <>
                                <Button text='Начать' className='mt-5'/>
                            </>
                        }
                    </Card>

                    <Card text='Параграф 6.' className='mt-3 xs:mt-0'>
                        {
                            isUserTeacher
                            ? <>
                                <Button text='Редактировать' className='mt-5'/>
                                <ButtonHollow text='Убрать' color='#DF0000' className='mt-3'/>
                            </>
                            : <>
                                <Button text='Начать' className='mt-5'/>
                            </>
                        }
                    </Card>
                    <Card text='Параграф 6.' className='mt-3 xs:mt-0'>
                        {
                            isUserTeacher
                            ? <>
                                <Button text='Редактировать' className='mt-5'/>
                                <ButtonHollow text='Убрать' color='#DF0000' className='mt-3'/>
                            </>
                            : <>
                                <Button text='Начать' className='mt-5'/>
                            </>
                        }
                    </Card>
                </div>

                {
                    isUserTeacher
                    ? <ButtonText text='Добавить тест' className='mt-5 xs:inline-block'/>
                    : <></>
                }
            </div>

            <div className='mt-8'>
                <p className="text-black text-4xl font-semibold font-montserrat mb-5">Материалы</p>
                <div className='md:flex flex-row col-auto flex-wrap flex overflow-x-auto w-full'>
                    <Card text='Так кто на кого нападал? Средневековье, фото в цвете'>
                    {
                            isUserTeacher
                            ? <>
                                <Button text='Редактировать' className='mt-5'/>
                                <ButtonHollow text='Убрать' color='#DF0000' className='mt-3'/>
                            </>
                            : <>
                                <Button text='Посмотреть' className='mt-5'/>
                            </>
                        }
                    </Card>
                </div>

                {
                    isUserTeacher
                    ? <ButtonText text='Добавить материал' className='mt-5 xs:inline-block'/>
                    : <></>
                }
            </div>

            <div className='h-full flex flex-col pb-8'>
                <div className='mt-auto mb-8 flex flex-col items-center'>
                    <p className="text-neutral-500 text-base font-normal font-montserrat">История35</p>
                    <ButtonText text='Выйти из комнаты' onClick={() => {navigate('/')}} className='mt-3'/>
                </div>
            </div>
        </div>
    </div>
  )
}