import { motion } from 'framer-motion';

export const ButtonHollow = ({className, onClick=()=>{}, text='Кнопка', color='#4355FF'}) => {
  
  return (
    <motion.div className={className} layout whileTap={{scale: 0.9}} whileHover={{scale: 0.98}}>
        <button 
            style={{borderColor: color}}
            className="w-full h-11 rounded-3xl border-2" 
            onClick={() => {
                onClick();
            }}>
            
            <div className="text-center text-stone-700 text-lg font-medium font-montserrat">{text}</div>
        </button>
    </motion.div>
  )
}