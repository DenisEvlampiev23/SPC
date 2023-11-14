import { motion } from 'framer-motion';

export const Button = ({className, onClick=()=>{}, text='Кнопка'}) => {
  
  return (
    <motion.div className={className} whileTap={{scale: 0.9}} whileHover={{scale: 0.98}} layout>
        <button 
            className="w-80 h-[45px] bg-brand rounded-3xl border border-gray-200" 
            onClick={() => {
                onClick();
            }}>
                <div className="text-center text-white text-lg font-medium font-montserrat">{text}</div>
        </button>
    </motion.div>
  )
}
