# Plano de Implementação - Gestão de Sobressalentes

Implementação completa das funcionalidades solicitadas para o sistema de controle de saída de materiais, integrando os dados da planilha e requisitos operacionais.

## Alterações Funcionais

### 1. Autenticação e Gestão de Usuários
- Implementar tela de login por matrícula e senha.
- Utilizar a lista de técnicos fornecida no mock de dados (`src/lib/data.functions.ts`).
- Adicionar funcionalidade de geração de senha inicial e opção de alteração de senha.

### 2. Registro de Movimentação (Saídas)
- **Campos Obrigatórios**: Código SAP (validação coerente com o catálogo), Quantidade, Data, Parque (SE, MA, NH), Aerogerador.
- **Campos Opcionais**: Número da WO (Work Order), Foto da peça (upload/câmera), Estoque de origem (1670 ou 1673).
- **Validação de SAP**: Ao digitar o código, o sistema deve buscar e exibir o nome da peça para confirmação.
- **Scanner de Código de Barras**: Adicionar integração com câmera para leitura rápida do código SAP.
- **Regra de Negócio**: Aerogerador Seabra 11 deve estar desabilitado/removido (conforme solicitado).

### 3. CRM e Insights (Dashboard)
- Gráficos de peças mais retiradas por parque e aerogerador.
- Insights automáticos baseados no histórico de saídas.
- Rank de técnicos com mais registros realizados corretamente.

### 4. Histórico e Relatórios
- Tela de consulta geral com filtros por data, técnico e peça.
- Exportação de relatórios nos formatos **XLSX** e **PDF**, mantendo a identidade visual do painel.

## Detalhes Técnicos

### Estrutura de Dados
- Atualizar `src/lib/data.functions.ts` com o catálogo completo da planilha Google Sheets.
- Criar funções para persistência (mock por enquanto) das movimentações registradas.

### Bibliotecas Adicionais
- `lucide-react` para ícones.
- `recharts` para o CRM.
- `react-qr-reader` ou similar para o scanner de código de barras.
- `jspdf` e `xlsx` para geração de relatórios.

### Estilo
- Manter o padrão Tailwind CSS v4 já estabelecido.
- Reforçar a responsividade para uso em campo pelos técnicos.

---
**Observação**: Como o link da planilha foi fornecido, farei o download e processamento do catálogo de materiais para garantir que a validação do SAP esteja correta.