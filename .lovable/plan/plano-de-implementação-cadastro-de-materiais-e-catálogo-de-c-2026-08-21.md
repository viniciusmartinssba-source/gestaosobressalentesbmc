# Plano de Implementação: Cadastro de Materiais e Catálogo de Consulta

Este plano descreve as etapas para integrar o cadastro de materiais a partir da planilha fornecida, permitindo que o sistema identifique automaticamente as peças pelo código SAP durante a retirada e forneça um catálogo de consulta robusto.

## Alterações Propostas

### 1. Backend e Dados (Supabase)

- **Migração de Dados**: Como não consigo ler diretamente o conteúdo da planilha via link (bloqueio de acesso/formato), prepararei um script (`src/lib/admin.functions.ts`) que permitirá a você colar os dados da planilha e processá-los para atualizar a tabela `pecas` no Supabase.
- **Estrutura**: Garantir que a tabela `pecas` tenha os campos `sap` (chave única) e `descricao`.

### 2. Fluxo de Registro (Frontend)

- **Auto-preenchimento**: No formulário de "Registrar Saída", ao digitar ou escanear um código SAP, o sistema buscará instantaneamente no catálogo e exibirá o nome da peça correspondente abaixo do campo.
- **Validação**: Impedir a confirmação da retirada se o código SAP não existir no banco de dados.

### 3. Novo Módulo: Catálogo

- **Interface de Consulta**: Criar uma nova aba/visão de "Catálogo" no menu lateral.
- **Busca Híbrida**: Implementar busca por Nome da Peça ou Código SAP.
- **Lista de Materiais**: Exibição em grid ou lista com destaque para os códigos.

### 4. Melhorias de UX

- **Feedback Visual**: Adicionar indicadores de "carregando" e "peça encontrada" no campo SAP.
- **Acessibilidade**: Garantir que a lista de catálogo seja responsiva e fácil de consultar em dispositivos móveis.

## Detalhes Técnicos

- Utilização de `useMemo` para filtragem eficiente no catálogo.
- Atualização das funções em `src/lib/data.functions.ts` para otimizar a busca por SAP.
- Implementação de um endpoint temporário ou ferramenta de admin para importação dos dados da planilha.

---

**Nota**: Como o link da planilha retornou erro de acesso ao tentar baixar os CSVs brutos, após a aprovação deste plano, eu fornecerei um componente/ferramenta de importação onde você poderá simplesmente colar o texto da planilha para popular o banco de dados.
