
import React from "react";
import CompanyForm from "@/components/CompanyForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Cadastro de Empresas e Setores
          </h1>
          <p className="text-gray-600">
            Adicione suas empresas e organize seus setores internos
          </p>
        </header>

        <CompanyForm />
      </div>
    </div>
  );
};

export default Index;
