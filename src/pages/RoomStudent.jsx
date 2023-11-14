import React from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonHollow } from '../components/ButtonHollow'
import { ButtonText } from '../components/ButtonText';

export const RoomStudent = () => {
  return (
    <div className='bg-back w-screen h-screen grid justify-items-center'>
        <div className='mt-8 w-screen h-full px-3 flex flex-col'>
            <div>
                <p className="text-black text-4xl font-semibold font-montserrat mb-5 ">Тесты</p>
                <div className='xs:flex flex-row flex-nowrap'>
                    <Card text='Параграф 8. Политическая карта средневековой Европы'>
                        <Button text='Начать' className='mt-5'/>
                    </Card>

                    <Card text='Параграф 6. Древний рим' className='mt-3 xs:mt-0'>
                        <ButtonHollow text='Ещё раз' className='mt-5'/>
                    </Card>
                </div>
            </div>

            <div className='mt-8'>
                <p className="text-black text-4xl font-semibold font-montserrat mb-5">Материалы</p>
                <div className='xs:flex flex-row flex-nowrap'>
                    <Card text='Так кто на кого нападал? Средневековье, фото в цвете'>
                        <Button text='Посмотреть' className='mt-5'/>
                    </Card>
                </div>
            </div>

            <div className='h-full flex flex-col pb-8'>
                <div className='mt-auto mb-8 flex flex-col items-center'>
                    <p className="text-neutral-500 text-base font-normal font-montserrat">История35</p>
                    <ButtonText text='Выйти из комнаты' className='mt-3'/>
                </div>
            </div>
        </div>
    </div>
  )
}