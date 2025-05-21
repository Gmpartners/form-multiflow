# Estrutura do Banco de Dados - Sistema Multi Atendimento

Esta documentação descreve a estrutura simplificada do banco de dados usado no Sistema Multi Atendimento para o cadastro de empresas e setores.

## Abordagem de Tabela Única

Para facilitar o uso e permitir maior flexibilidade, o sistema utiliza uma única tabela que contém todos os dados necessários. Isso permite que o cliente possa adicionar múltiplos registros, mesmo que contenha informações duplicadas ou parciais, sem a necessidade de criar relacionamentos complexos.

## Estrutura da Tabela

```
+-----------------------------------+
|        COMPANY_SECTORS            |
+-----------------------------------+
| id (UUID)                         |
| empresa_nome                      |
| empresa_descricao                 |
| setor_nome                        |
| setor_descricao                   |
| setor_quando_transferir           |
| setor_responsavel_nome            |
| setor_responsavel_email           |
| setor_campos (JSONB)              |
| created_at                        |
| updated_at                        |
+-----------------------------------+
```

## Descrição dos Campos

| Campo                     | Tipo      | Descrição                                       | Obrigatório |
|---------------------------|-----------|------------------------------------------------|------------|
| id                        | UUID      | Identificador único, gerado automaticamente     | Sim        |
| empresa_nome              | TEXT      | Nome da empresa                                | Sim        |
| empresa_descricao         | TEXT      | Descrição detalhada da empresa                 | Sim        |
| setor_nome                | TEXT      | Nome do setor                                  | Sim        |
| setor_descricao           | TEXT      | Descrição do setor                             | Sim        |
| setor_quando_transferir   | TEXT      | Quando transferir para este setor              | Não        |
| setor_responsavel_nome    | TEXT      | Nome do responsável pelo setor                 | Não        |
| setor_responsavel_email   | TEXT      | Email do responsável pelo setor                | Não        |
| setor_campos              | JSONB     | Array de objetos com campos customizados       | Não        |
| created_at                | TIMESTAMP | Data/hora de criação (automático)              | Sim        |
| updated_at                | TIMESTAMP | Data/hora da última atualização (automático)   | Sim        |

## Estrutura do Campo setor_campos

O campo `setor_campos` é do tipo JSONB e armazena um array de objetos, onde cada objeto representa um campo customizado do setor. A estrutura de cada objeto é:

```json
{
  "name": "Nome do Campo"
}
```

Por exemplo, para um setor que tenha campos como "Nome do Cliente", "Email" e "Problema", o JSON seria:

```json
[
  { "name": "Nome do Cliente" },
  { "name": "Email" },
  { "name": "Problema" }
]
```

## Vantagens da Abordagem de Tabela Única

1. **Simplicidade**: Uma única tabela é mais fácil de gerenciar e entender
2. **Flexibilidade**: O cliente pode adicionar registros parciais ou duplicados sem problemas
3. **Performance**: Consultas simplificadas e mais rápidas
4. **Facilidade de Backup/Exportação**: Todos os dados estão em um único lugar
5. **Manutenção**: Não é necessário gerenciar relacionamentos entre tabelas

## Limitações

1. **Redundância de dados**: Informações da empresa podem ser repetidas em múltiplos registros
2. **Falta de integridade referencial**: Não há garantias automáticas de consistência entre registros

## Como usar os dados

Para análise posterior, os dados podem ser facilmente agrupados por `empresa_nome` para ver todos os setores de uma mesma empresa, ou filtrados por outros critérios conforme necessário.

Exemplo de SQL para agrupar por empresa:

```sql
SELECT empresa_nome, COUNT(*) as total_setores
FROM company_sectors
GROUP BY empresa_nome
ORDER BY total_setores DESC;
```

Esta estrutura simplificada é ideal para um caso de uso onde um único cliente está gerenciando seus próprios dados, com foco na facilidade de uso e flexibilidade.
