import React, { useEffect, useRef, useState } from 'react'
import { motion, useForceUpdate } from 'framer-motion'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonHollow } from '../components/ButtonHollow'
import { ButtonText } from '../components/ButtonText';
import server from '../server';
import { useLocation, useNavigate } from 'react-router-dom';
import { child, get } from 'firebase/database'

export const CreateTest = () => {
    const navigate = useNavigate();
    const state = useLocation();

    const [, forceUpdate] = useState();
    const [fileTitle, setFileTitle] = useState(state.state === null ? 'Новый тест' : state.state.test.fileTitle);
    const [questions, setQuestions] = useState([{
        title: '',
        description: null,
        image: null,
        answers: ['']
    }]);
    const [historyTests, setHistoryTests] = useState([]);

    const hiddenFileInput = useRef(null);

    useEffect(() => {
        let test = null;

        if(state.state !== null && state.state !== undefined){
            test = state.state.test;
            
            setFileTitle(test.fileTitle !== null ? test.fileTitle : '');
            setQuestions(test.questions !== undefined ? test.questions : []);
        }

        try{
            get(child(server.refDatabase, `/users/${server.uid}/tests`))
                .then(snapshot => {
                    const data = snapshot.val();
        
                    if(data === null){
                        setHistoryTests([]);
                    } else {
                        setHistoryTests(data.reverse());
                    }
                });
            } catch(e){
                console.log(e);
            }
    }, []);

    const uploadEditedTest = async () => {
        await server.createTest(fileTitle, questions);
        await server.unpublishTest(state.state.test.fileTitle);
        server.useTest(fileTitle);
        
        navigate('/lesson');
    }

    const uploadTest = async () => {
        await server.createTest(fileTitle, questions);
        server.useTest(fileTitle);

        navigate('/lesson');
    }

    const publishTest = async (fileTitle) => {
        await server.useTest(fileTitle);

        navigate('/lesson');
    }

    const addQuestion = () => {
        const modifiedQuestions = questions;

        modifiedQuestions.push({
            title: null,
            description: null,
            image: null,
            answers: ['']
        });

        setQuestions(modifiedQuestions);
        forceUpdate({});
    }

    const deleteQuestion = (index) => {
        if(index === 0)
            return;

        let modifiedQuestions = questions;

        modifiedQuestions.splice(index, 1);
        setQuestions(modifiedQuestions);
        forceUpdate({});
    }

    const changeQuestionTitle = (title, index) => {
        const modifiedQuestions = questions; 
        modifiedQuestions[index].title = title;
        setQuestions(modifiedQuestions);
    }

    const changeQuestionDescription = (description, index) => {
        const modifiedQuestions = questions; 
        modifiedQuestions[index].description = description;
        setQuestions(modifiedQuestions);
    }

    const changeQuestionImage = (image, index) => {
        if(image === null){
            questions[index].image = null;
            forceUpdate({});
        } else {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                const base64String = reader.result
                    .replace('data:', '')
                    .replace(/^.+,/, '');
        
                let modifiedQuestions = questions; 
                modifiedQuestions[index].image = `data:image/png;base64,${base64String}`;
                setQuestions(modifiedQuestions);
                forceUpdate({});
            };
            
            reader.readAsDataURL(image);
        }
    }

    const changeQuestionAnswer = (newAnswer, index, answerIndex) => {
        let modifiedQuestions = questions;

        modifiedQuestions[index].answers[answerIndex] = newAnswer;
        setQuestions(modifiedQuestions);
    }

    const addQuestionAnswer = (index) => {
        let modifiedQuestions = questions;
        
        modifiedQuestions[index].answers.push(null);
        setQuestions(modifiedQuestions);
        forceUpdate({});
    }

    const deleteQuestionAnswer = (index, answerIndex) => {
        let modifiedQuestions = questions;
        
        modifiedQuestions[index].answers.splice(answerIndex, 1);
        setQuestions(modifiedQuestions);
        forceUpdate({});
    }

    const getWithoutFirst = (array=[]) => {
        let newArray = array;
        
        return newArray.slice(1, array.length);
    }

    return (
        <div className='w-screen grid justify-items-center pb-2/6'>
            <div className='absolute bg-back w-full h-full -z-10'/>

            <div className='mt-8 w-screen h-screen px-3 flex flex-col xs:items-center'>
                <div className='flex flex-col'>
                    <ButtonText text='Назад' onClick={() => {navigate('/lesson')}} className="inline-block self-start"/>

                    <motion.p layout className="text-black text-4xl font-semibold font-montserrat mt-3 w-80 break-words self-start">{fileTitle !== null && fileTitle !== '' ? fileTitle : 'Новый тест'}</motion.p>
                    <motion.input 
                        layout
                        whileTap={{scale: 0.98}}
                        whileFocus={{borderColor: '#4355FF'}}
                        defaultValue={fileTitle !== null ? fileTitle : ''}
                        onChange={e => {setFileTitle(e.target.value)}}
                        placeholder='Название теста'  
                        className="w-full h-10 bg-neutral-100 rounded-xl border border-gray-200 p-2 mt-3 text-lg" />
            
                    {
                        questions.map((question, index) => {
                            return <Card text='' key={Math.random()} className='mt-5 xs:w-80'>
                                <motion.p layout onDoubleClick={() => deleteQuestion(index)} className="text-black text-2xl font-semibold font-montserrat select-none cursor-pointer">{`Вопрос ${index+1}`}</motion.p>

                                <motion.input 
                                    layout
                                    whileTap={{scale: 0.98}}
                                    whileFocus={{borderColor: '#4355FF'}}
                                    defaultValue={question.title !== null ? question.title : ''}
                                    onChange={e => {changeQuestionTitle(e.target.value, index)}}
                                    placeholder='Вопрос'  
                                    className="w-full h-10 bg-neutral-100 rounded-xl border border-gray-200 p-2 mt-3 text-lg" />

                                <motion.textarea 
                                    layout
                                    whileTap={{scale: 0.98}}
                                    whileFocus={{borderColor: '#4355FF'}}
                                    defaultValue={question.description !== null ? question.description : ''}
                                    onChange={e => {changeQuestionDescription(e.target.value, index)}}
                                    placeholder='Описание'  
                                    className="w-full h-28 mt-3 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />

                                {
                                    question.image !== null
                                    ? <img onDoubleClick={() => {changeQuestionImage(null, index)}} src={question.image} className='rounded-xl mt-3 w-full select-none'/>
                                    : <></>
                                }

                                <input type='file' accept='image/*' onChange={(e) => {changeQuestionImage(e.target.files[0], index)}} className="hidden select-none" ref={hiddenFileInput}/>
                                <Button 
                                    text={question.image !== null ? 'Заменить изображение' : 'Добавить изображение'}
                                    className='mt-5'
                                    onClick={() => {hiddenFileInput.current.click()}}/>

                                <motion.p layout className="text-black text-2xl font-semibold font-montserrat mt-5">Ответ</motion.p>

                                <motion.input 
                                    layout
                                    whileTap={{scale: 0.98}}
                                    whileFocus={{borderColor: '#4355FF'}}
                                    defaultValue={question.answers[0] !== null &&  question.answers[0] !== undefined ? question.answers[0] : ''}
                                    onChange={e => {changeQuestionAnswer(e.target.value, index, 0)}}
                                    placeholder='Правильный ответ'  
                                    className="w-full h-10 bg-neutral-100 rounded-xl border border-gray-200 p-2 mt-3 text-lg" />

                                {
                                    question.answers.length >= 2
                                    ? <div>
                                        <motion.p layout className="text-black text-xl font-semibold font-Montserrat mt-5">Неправильные ответы</motion.p>

                                        {
                                            getWithoutFirst(question.answers).map((answer, answerIndex) => {
                                                return <motion.input 
                                                    key={Math.random()}
                                                    layout
                                                    initial={{opacity: 0.8}}
                                                    animate={{opacity: 1}}
                                                    whileTap={{scale: 0.98}}
                                                    whileFocus={{borderColor: '#4355FF'}}
                                                    defaultValue={answer !== null ? answer : ''}
                                                    onDoubleClick={() => {deleteQuestionAnswer(index, answerIndex+1)}}
                                                    onChange={e => {changeQuestionAnswer(e.target.value, index, answerIndex+1)}}
                                                    placeholder='Неправильный ответ'  
                                                    className="w-full h-10 bg-neutral-100 rounded-xl border border-gray-200 p-2 mt-3 text-lg" />
                                            })
                                        }
                                    </div> 
                                    : <></>
                                }

                                <Button 
                                    text={question.answers.length <= 1 || question.answers.length === null ? 'Сделать тест' : 'Добавить вариант'}
                                    onClick={() => {addQuestionAnswer(index)}}
                                    className='mt-5' />

                            </Card>
                        })
                    }

                    <Button onClick={() => addQuestion()} text='Добавить вопрос'/>
                    <ButtonHollow onClick={state.state === null ? uploadTest : uploadEditedTest} text='Опубликовать' className='mt-3'/>
                <motion.p layout className="text-black text-3xl font-semibold font-montserrat mt-7">История</motion.p> 
                </div>

                <div>
                    <motion.div layout className='flex flex-nowrap w-screen xs:mx-5 overflow-x-auto bg-scroll'>
                    {
                        historyTests !== undefined && historyTests !== null && historyTests.length !== 0
                        ? historyTests.map((test) => {
                            return <Card text={test.fileTitle} key={Math.random()} className='mt-5 xs:ml-3 xs:w-80'>

                            <Button text='Использовать' onClick={() => {publishTest(test.fileTitle)}} className='mt-5'/>
                            <div className='w-60'/>
                        </Card>
                        }) : <motion.p layout className="w-80 text-center text-neutral-500 text-lg font-base mt-5 font-Montserrat mx-auto">Здесь пока что ничего нет.</motion.p>
                    }
                    </motion.div>
                </div>
            </div>
        </div>
    )
}