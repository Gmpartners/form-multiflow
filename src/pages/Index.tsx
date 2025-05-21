
import React from "react";
import CompanyForm from "@/components/CompanyForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-white py-4 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-5xl">
        <header className="mb-6 sm:mb-10 text-center">
          <div className="inline-block mb-3 sm:mb-4 bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
            <h2 className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider">
              SISTEMA MULTI ATENDIMENTO
            </h2>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 relative inline-block">
            Cadastro de Empresas e Setores
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-accent rounded-full"></span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Adicione suas empresas e organize seus setores internos com facilidade
          </p>
        </header>

        {/* Card explicativo simplificado sem mencionar campos obrigatórios */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 sm:mb-10 rounded-r-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm sm:text-base text-blue-700">
                <strong>Como utilizar:</strong> Adicione empresas clicando no botão "Adicionar Empresa". Para cada empresa, você pode adicionar um ou mais setores. Quando finalizar, clique em "Salvar Dados".
              </p>
            </div>
          </div>
        </div>

        <CompanyForm />
        
        <footer className="mt-10 sm:mt-16 text-center text-gray-500 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} GM Partners | Sistema de Gestão Empresarial</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
