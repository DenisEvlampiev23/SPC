import React, { useEffect, useRef, useState } from 'react'
import { motion, useForceUpdate } from 'framer-motion'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonHollow } from '../components/ButtonHollow'
import { ButtonText } from '../components/ButtonText';
import server from '../server';
import { useLocation, useNavigate } from 'react-router-dom';
import { child, get } from 'firebase/database'

export const ViewTest = () => {
    const navigate = useNavigate();
    const state = useLocation();
    const test = state.state;

    const [, forceRerender] = useState();
    const [givenAnswers, setGivenAnswers] = useState(['']);

    const changeGivenAnswer = (answer='', index, needRerender=false) => {
        const modifiedGivenAnswers = givenAnswers;
        modifiedGivenAnswers[index] = answer;
        setGivenAnswers(modifiedGivenAnswers);

        if(needRerender === true)
            forceRerender({});
    }

    const completeTest = () => {
        server.completeTest(test.fileTitle, givenAnswers);

        navigate('/lesson');
    }

    return (
        <div className='w-screen grid justify-items-center pb-2/6'>
            <div className='absolute bg-back w-full h-full -z-10'/>

            <div className='mt-8 w-screen h-screen px-3 flex flex-col xs:items-center'>
                <div className='flex flex-col'>
                    <ButtonText text='Прекратить выполнение' onClick={() => {navigate('/lesson')}} className="inline-block self-start"/>

                    <motion.p layout className="text-black text-4xl font-semibold font-montserrat mt-3 w-80 break-words self-start">{test.fileTitle}</motion.p>
                    
                    {
                        test.questions.map((question, index) => {
                            return <Card text='' key={Math.random()} className='mt-3 xs:w-80'>
                                <motion.p layout className="text-black text-2xl font-semibold font-montserrat select-none cursor-pointer">{`${index+1}. ${question.title}`}</motion.p>

                                {
                                    question.image !== null
                                    ? <img src={question.image} className='rounded-xl mt-3 w-full select-none'/>
                                    : <></>
                                }

                                <motion.p className="text-stone-900 text-base font-normal mt-3 font-montserrat">{question.description}</motion.p>

                                {
                                    question.answers.length === 1 
                                    ? <motion.input 
                                        className="w-full h-10 mt-5 rounded-xl border text-center border-neutral-400" 
                                        layout
                                        whileTap={{scale: 0.95}}
                                        whileFocus={{borderColor: '#4355FF'}}
                                        defaultValue={givenAnswers[index]}
                                        onChange={e => {changeGivenAnswer(e.target.value, index)}}
                                        placeholder='Ввести ответ' />
                                    : <motion.div>
                                        {
                                            question.answers.map((answer) => {
                                                return(
                                                    <motion.button 
                                                        key={Math.random()}
                                                        layout 
                                                        whileTap={{borderColor: '#4355FF'}}
                                                        animate={{borderColor: givenAnswers[index] === answer ? '#4355FF' : '#A3A3A3'}}
                                                        onClick={() => changeGivenAnswer(answer, index, true)}
                                                        className="w-full h-10 mt-2 rounded-xl border text-center border-neutral-400">
                                                        <motion.div layout animate={{color: givenAnswers[index] === answer ? '#4355FF' : '#1c1917'}} className="text-center text-stone-900 text-base font-medium font-montserrat">{answer}</motion.div>
                                                    </motion.button>
                                                );
                                            })
                                        }
                                    </motion.div>
                                }
                            </Card>
                        })
                    }

                    <Button text='Завершить' onClick={completeTest} className='mt-5 mb-10'/>
                </div>
            </div>
        </div>
    )
}