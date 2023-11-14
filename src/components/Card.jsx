import React from 'react'
import { motion } from 'framer-motion'

export const Card = ({text='Активность', children, onClick=()=>{}, className=''}) => {
  return (
    <motion.div whileHover={{scale: 1.01}} layout className='sm:w-80 xs:ml-3 grow-0'>
      <div className={className} >
        <div className="w-full bg-white rounded-xl p-3 shadow-lg mr-2" >
            <p className="text-black text-base font-semibold font-montserrat">{text}</p>
            {children}
        </div>
      </div>
    </motion.div>
  )
}
