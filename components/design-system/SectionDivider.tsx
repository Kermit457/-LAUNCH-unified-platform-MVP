'use client';

import { motion } from 'framer-motion';

export const SectionDivider = () => {
  return (
    <div className="relative py-16">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"
      />
    </div>
  );
};
