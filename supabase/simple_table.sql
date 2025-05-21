-- Script SQL para criar a tabela única no Supabase

-- Remover tabelas existentes se necessário (cuidado, isso apagará dados existentes)
DROP TABLE IF EXISTS sector_fields CASCADE;
DROP TABLE IF EXISTS sectors CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Criar a tabela única para todos os dados
CREATE TABLE company_sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_nome TEXT NOT NULL,
    empresa_descricao TEXT,
    setor_nome TEXT NOT NULL,
    setor_descricao TEXT,
    setor_quando_transferir TEXT,
    setor_responsavel_nome TEXT,
    setor_responsavel_email TEXT,
    setor_campos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar um trigger para atualizar a data de modificação
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_sectors_modtime
BEFORE UPDATE ON company_sectors
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Criar um índice para busca por nome de empresa
CREATE INDEX idx_company_sectors_empresa_nome ON company_sectors(empresa_nome);
