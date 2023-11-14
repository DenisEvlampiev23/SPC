import React from 'react'
import { motion } from 'framer-motion'

export const Logo = ({className}) => {

  return (
    <div className={className}>
        <motion.div className="text-center" whileDrag={{scale: 0.9, rotate: -10}} drag dragSnapToOrigin dragElastic={0.2} whileHover={{rotate: 0.2}}>
            <span className="text-black text-5xl font-semibold font-montserrat">Vedaj</span>
            <span className="text-brand text-5xl font-semibold font-montserrat">.blyat</span>
        </motion.div>

    </div>
  )
}
