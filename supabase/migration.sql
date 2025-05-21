-- Script SQL para criar as tabelas no Supabase

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alterar a tabela de empresas para incluir client_id
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS client_id TEXT REFERENCES clients(id);

-- Criar índice para consultas por client_id
CREATE INDEX IF NOT EXISTS idx_companies_client_id ON companies(client_id);

-- Adicionar coluna responsible_email à tabela sectors (se ainda não existir)
ALTER TABLE sectors 
ADD COLUMN IF NOT EXISTS responsible_email TEXT;

-- Adicionar restrições de chave estrangeira (se ainda não existirem)
ALTER TABLE sectors
DROP CONSTRAINT IF EXISTS sectors_company_id_fkey,
ADD CONSTRAINT sectors_company_id_fkey 
FOREIGN KEY (company_id) 
REFERENCES companies(id) 
ON DELETE CASCADE;

ALTER TABLE sector_fields
DROP CONSTRAINT IF EXISTS sector_fields_sector_id_fkey,
ADD CONSTRAINT sector_fields_sector_id_fkey 
FOREIGN KEY (sector_id) 
REFERENCES sectors(id) 
ON DELETE CASCADE;

-- Ativar RLS (Row Level Security) para proteção dos dados
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela companies
CREATE POLICY "Clientes podem ver suas próprias empresas"
ON companies
FOR SELECT
USING (client_id = current_user OR auth.role() = 'service_role');

CREATE POLICY "Clientes podem inserir suas próprias empresas"
ON companies
FOR INSERT
WITH CHECK (client_id = current_user OR auth.role() = 'service_role');

CREATE POLICY "Clientes podem atualizar suas próprias empresas"
ON companies
FOR UPDATE
USING (client_id = current_user OR auth.role() = 'service_role');

CREATE POLICY "Clientes podem excluir suas próprias empresas"
ON companies
FOR DELETE
USING (client_id = current_user OR auth.role() = 'service_role');

-- Criar políticas para a tabela sectors
CREATE POLICY "Acesso a setores de empresas do cliente"
ON sectors
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM companies
    WHERE companies.id = sectors.company_id
    AND (companies.client_id = current_user OR auth.role() = 'service_role')
  )
);

-- Criar políticas para a tabela sector_fields
CREATE POLICY "Acesso a campos de setores de empresas do cliente"
ON sector_fields
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM sectors
    JOIN companies ON sectors.company_id = companies.id
    WHERE sectors.id = sector_fields.sector_id
    AND (companies.client_id = current_user OR auth.role() = 'service_role')
  )
);
