// Arquivo para gerenciar o ID do cliente e sua persistência

import { supabaseAdmin } from '@/integrations/supabase/client';

// Chave para armazenar o ID do cliente no localStorage
const CLIENT_ID_KEY = 'multiflow_client_id';
const CLIENT_NAME_KEY = 'multiflow_client_name';
const CLIENT_EMAIL_KEY = 'multiflow_client_email';

// Gerar um ID único usando nanoid
function generateUniqueId() {
  return 'client_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Obter o ID do cliente do localStorage ou gerar um novo
export const getClientId = async () => {
  // Verificar se já existe um ID no localStorage
  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  const clientName = localStorage.getItem(CLIENT_NAME_KEY) || 'Cliente';
  const clientEmail = localStorage.getItem(CLIENT_EMAIL_KEY) || 'cliente@exemplo.com';
  
  // Se não existir, gerar um novo ID
  if (!clientId) {
    clientId = generateUniqueId();
    
    // Salvar o novo ID no localStorage
    localStorage.setItem(CLIENT_ID_KEY, clientId);
    
    // Se não tiver nome ou email, usar valores padrão
    if (!localStorage.getItem(CLIENT_NAME_KEY)) {
      localStorage.setItem(CLIENT_NAME_KEY, clientName);
    }
    
    if (!localStorage.getItem(CLIENT_EMAIL_KEY)) {
      localStorage.setItem(CLIENT_EMAIL_KEY, clientEmail);
    }
    
    // Salvar o cliente no banco de dados
    try {
      await supabaseAdmin.from('clients').insert({
        id: clientId,
        name: clientName,
        email: clientEmail
      });
    } catch (error) {
      console.error('Erro ao salvar cliente no banco de dados:', error);
    }
  }
  
  return clientId;
};

// Obter o nome do cliente
export const getClientName = () => {
  return localStorage.getItem(CLIENT_NAME_KEY) || 'Cliente';
};

// Obter o email do cliente
export const getClientEmail = () => {
  return localStorage.getItem(CLIENT_EMAIL_KEY) || 'cliente@exemplo.com';
};

// Atualizar informações do cliente
export const updateClientInfo = async (name: string, email: string) => {
  const clientId = await getClientId();
  
  localStorage.setItem(CLIENT_NAME_KEY, name);
  localStorage.setItem(CLIENT_EMAIL_KEY, email);
  
  try {
    await supabaseAdmin.from('clients').update({
      name,
      email
    }).eq('id', clientId);
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return false;
  }
};

// Limpar dados do cliente (logout)
export const clearClientData = () => {
  localStorage.removeItem(CLIENT_ID_KEY);
  localStorage.removeItem(CLIENT_NAME_KEY);
  localStorage.removeItem(CLIENT_EMAIL_KEY);
};

export default {
  getClientId,
  getClientName,
  getClientEmail,
  updateClientInfo,
  clearClientData
};