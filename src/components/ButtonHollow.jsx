import { motion } from 'framer-motion';

export const ButtonHollow = ({className, onClick=()=>{}, text='Кнопка'}) => {
  
  return (
    <motion.div className={className} layout whileTap={{scale: 0.9}} whileHover={{scale: 0.98}}>
        <button 
            className="w-80 h-[45px] rounded-3xl border-2 border-brand" 
            onClick={() => {
                onClick();
            }}>
            
            <div className="text-center text-stone-700 text-lg font-medium font-montserrat">{text}</div>
        </button>
    </motion.div>
  )
}