import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { ButtonHollow } from '../components/ButtonHollow'
import { ButtonText } from '../components/ButtonText';
import server from '../server';
import { useLocation, useNavigate } from 'react-router-dom';
import { child, get } from 'firebase/database'

export const CreateMaterial = () => {
    const navigate = useNavigate();
    const state = useLocation();
    
    const [editableMaterial, setEditableMaterial] = useState(null);
    const [title, setTitle] = useState('Untitled');
    const [description, setDescription] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [historyMaterials, setHistoryMaterials] = useState([]);

    const hiddenFileInput = useRef(null);
    
    useEffect(() => {
        let material = null;

        if(state.state !== null && state.state !== undefined)
            material = state.state.material;

        if(material !== null && material !== undefined){
            setEditableMaterial(state.state.material);
            setTitle(material.title);
            setDescription(material.description);

            if(material.image !== null && material.image !== undefined){
                setImageFile(material.image);
            }
        }

        try{
            get(child(server.refDatabase, `/users/${server.uid}/materials`))
                .then(snapshot => {
                    const data = snapshot.val();
        
                    if(data === null){
                        setHistoryMaterials([]);
                    } else {
                        setHistoryMaterials(data);
                    }
                });
        } catch(e){
            console.log(e);
        }
    }, []);

    const addImage = (image) => {
        const reader = new FileReader();
    
        reader.onloadend = () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
    
            console.log(`data:image/png;base64,${base64String}`);
            setImageFile(`data:image/png;base64,${base64String}`);
        };
        
        reader.readAsDataURL(image);
    }
    
    const uploadEditedMaterial = async () => {
        await server.createMaterial(title.trim(), description, imageFile);
        await server.unpublishMaterial(editableMaterial.title);
        server.useMaterial(title.trim());
        
        navigate('/lesson');
    }

    const uploadMaterial = async () => {
        await server.createMaterial(title.trim(), description, imageFile);
        server.useMaterial(title);

        navigate('/lesson');
    }

    const publishMaterial = async (title='') => {
        await server.useMaterial(title.trim());

        navigate('/lesson');
    }

    return (
        <div className='w-screen grid justify-items-center'>
            <div className='absolute bg-back w-full h-full -z-10'/>

            <div className='mt-8 w-screen h-screen px-3 flex flex-col xs:items-center'>
                <div>
                    <ButtonText text='Назад' onClick={() => {navigate('/lesson')}} className="inline-block"/>

                    <Card text='' className='mt-5 xs:w-80'>
                        <p className="text-black text-3xl font-semibold font-montserrat">Новый материал</p>

                        <motion.input 
                            whileTap={{scale: 0.98}}
                            whileFocus={{borderColor: '#4355FF'}}
                            defaultValue={editableMaterial !== null ? editableMaterial.title : ''}
                            onChange={e => {setTitle(e.target.value)}}
                            placeholder='Название'  
                            className="w-full h-10 bg-neutral-100 rounded-xl border border-gray-200 p-2 mt-3 text-lg" />

                        <motion.textarea 
                            whileTap={{scale: 0.98}}
                            whileFocus={{borderColor: '#4355FF'}}
                            defaultValue={editableMaterial !== null ? editableMaterial.description : ''}
                            onChange={e => {setDescription(e.target.value)}}
                            placeholder='Описание'  
                            className="w-full h-28 mt-3 bg-neutral-100 rounded-xl border border-gray-200 p-2 text-lg" />

                        {
                            imageFile !== null
                            ? <img onDoubleClick={() => {setImageFile(null);}} src={imageFile} className='rounded-xl mt-3 w-full'/>
                            : <></>
                        }

                        <input type='file' accept='image/*' onChange={(e) => {addImage(e.target.files[0])}} className="hidden" ref={hiddenFileInput}/>
                        <ButtonHollow 
                            text='Добавить изображение'
                            className='mt-5'
                            onClick={() => {hiddenFileInput.current.click()}}    
                        />
                        <Button text='Опубликовать' onClick={editableMaterial === null ? uploadMaterial : uploadEditedMaterial} className='mt-3'/>
                    </Card>
                    <p className="text-black text-3xl font-semibold font-montserrat mt-7">История</p> 
                </div>

                <div>
                    <div className='flex flex-nowrap w-screen xs:mx-5 overflow-x-auto bg-scroll'>
                    {
                        historyMaterials !== undefined
                        ? historyMaterials.map((material) => {
                            return <Card text={material.title} key={material.title} className='mt-5 xs:w-80'>
                            {
                                material.image !== null && material.image !== undefined && material.image !== ''
                                ? <img src={material.image} className='mt-3 rounded-xl w-full'/>
                                : <></>
                            }

                            <Button text='Использовать' onClick={() => {publishMaterial(material.title)}} className='mt-5'/>
                            <div className='w-60'/>
                        </Card>
                        }) : <></>
                    }
                    </div>
                </div>
                </div>
            </div>
    )
}