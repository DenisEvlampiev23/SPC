import { motion } from 'framer-motion';

export const ButtonText = ({className, onClick=()=>{}, text='Кнопка'}) => {
  
  return (
    <motion.div className={className} whileTap={{scale: 0.9}} whileHover={{scale: 0.98}} layout>
        <div  
        className="text-center text-neutral-500 text-base font-semibold font-montserrat underline cursor-pointer" 
        onClick={() => {
                onClick();
            }}
        >{text}</div>
    </motion.div>
  )
}
