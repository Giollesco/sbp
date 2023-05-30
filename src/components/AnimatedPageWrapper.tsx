import { motion } from 'framer-motion';
import React from 'react'

type Props = {
    children: React.ReactNode;
    _key: string
}

const AnimatedPageWrapper = ({ _key, children }: Props) => {
  return (
    <motion.div
      key={_key}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
    >
        { children }
    </motion.div>
  )
}

export default AnimatedPageWrapper