
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
  totalCompanies: number;
  totalSectors: number;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ totalCompanies, totalSectors, onReset }) => {
  const [showArrow, setShowArrow] = useState(false);
  
  // Mostrar a seta animada após um pequeno intervalo
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArrow(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 sm:p-8 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6"
          >
            <CheckCircle className="h-10 w-10 sm:h-16 sm:w-16 text-green-600" />
          </motion.div>
          
          <motion.h2 
            className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Dados Salvos com Sucesso!
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-xl text-gray-600 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Obrigado por utilizar nosso sistema
          </motion.p>
          
          <motion.div
            className="text-gray-600 mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="font-medium text-base sm:text-lg mb-1">Resumo do cadastro:</p>
            <p className="text-gray-700">
              {totalCompanies} {totalCompanies === 1 ? 'empresa' : 'empresas'} e {totalSectors} {totalSectors === 1 ? 'setor' : 'setores'} cadastrados
            </p>
          </motion.div>
          
          {showArrow && (
            <motion.div 
              className="text-green-600 mb-4 sm:mb-6"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.2
              }}
            >
              <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse" />
            </motion.div>
          )}
          
          <div className="flex gap-4">
            <Button 
              onClick={onReset} 
              className="bg-primary hover:bg-primary/90 px-4 py-2 sm:px-6 sm:py-3 text-white rounded-lg shadow-md flex items-center text-sm sm:text-base"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Novo Cadastro
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessMessage;
