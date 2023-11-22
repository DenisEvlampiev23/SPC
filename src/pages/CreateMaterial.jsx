import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonHollow } from '../components/ButtonHollow'
import { ButtonText } from '../components/ButtonText';
import server from '../server';
import { useNavigate } from 'react-router-dom';

export const CreateMaterial = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('Untitled');
    const [description, setDescription] = useState(null);
    const [imageLocalURL, setImageLocalURL] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const hiddenFileInput = useRef(null);

    const addImage = (image) => {
        setImageFile(image);
        setImageLocalURL(URL.createObjectURL(image))
    }

    const uploadMaterial = async () => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
            
            server.createMaterial(title, description, base64String);
            server.useMaterial(title);
            
            navigate('/lesson');
        };
        if(imageFile !== null){
            reader.readAsDataURL(imageFile);
        } else {
            server.createMaterial(title, description);
            server.useMaterial(title);
            
            navigate('/lesson');
        }
    }

    const publishMaterial = async (title) => {
        await server.useMaterial(title);

        navigate('/lesson');
    }

    return (
        <div className='w-screen grid justify-items-center'>
            <div className='absolute bg-back w-full h-full -z-10'/>

            <div className='mt-8 w-screen h-full pl-3 flex flex-col xs:items-center'>
                <div>
                    <ButtonText text='Назад' onClick={() => {navigate('/lesson')}} className="inline-block"/>

                    <Card text='' className='mt-5 mr-3 xs:w-80'>
                        <p className="text-black text-3xl font-semibold font-montserrat">Новый материал</p>

                        <motion.input 
                            whileTap={{scale: 0.98}}
                            whileFocus={{borderColor: '#4355FF'}}
                            onChange={e => {setTitle(e.target.value)}}
                            placeholder='Название'  
                            className="w-full h-10 bg-neutral-100 rounded-xl border border-gray-200 p-2 mt-3 text-lg" />

                        <motion.textarea 
                            whileTap={{scale: 0.98}}
                            whileFocus={{borderColor: '#4355FF'}}
                            onChange={e => {setDescription(e.target.value)}}
                            placeholder='Описание'  
                            className="w-full h-28 mt-3 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />

                        {
                            imageLocalURL !== null
                            ? <img onDoubleClick={() => {setImageLocalURL(null); setImageFile(null);}} src={imageLocalURL} className='rounded-xl mt-3 w-full'/>
                            : <></>
                        }

                        <input type='file' accept='image/*' onChange={(e) => {addImage(e.target.files[0])}} className="hidden" ref={hiddenFileInput}/>
                        <ButtonHollow 
                            text='Добавить изображение'
                            className='mt-5'
                            onClick={() => {hiddenFileInput.current.click()}}    
                        />
                        <Button text='Опубликовать' onClick={uploadMaterial} className='mt-3'/>
                    </Card>

                    <div>
                        <p className="text-black text-3xl font-semibold font-montserrat mt-7">История</p> 

                        <div>
                            <Card text='Так кто на кого нападал?' className='mt-5 xs:w-80'>
                                {
                                    true === true
                                    ? <img src='https://via.placeholder.com/311x78' className='mt-3 rounded-xl w-full'/>
                                    : <></>
                                }

                                <Button text='Использовать' onClick={() => {publishMaterial('Так кто на кого нападал?')}} className='mt-5'/>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}