import React from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  trigger: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  isOpen,
  onToggle,
  trigger,
  children,
  disabled = false
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <motion.button
        onClick={disabled ? undefined : onToggle}
        className={`w-full p-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        whileHover={disabled ? {} : { backgroundColor: '#f9fafb' }}
        whileTap={disabled ? {} : { scale: 0.99 }}
        disabled={disabled}
      >
        {trigger}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ⬇️
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};