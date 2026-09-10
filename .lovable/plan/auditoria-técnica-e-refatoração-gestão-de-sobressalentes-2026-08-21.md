# Auditoria Técnica e Refatoração - Gestão de Sobressalentes

Este plano visa realizar uma auditoria completa no projeto, corrigindo bugs identificados, melhorando a arquitetura e garantindo que todas as funcionalidades solicitadas funcionem de forma profissional e segura.

## Alterações Propostas

### 1. Autenticação e Segurança

- **Persistência de Sessão**: Implementar um `AuthProvider` e o hook `useAuth` para gerenciar a sessão do técnico (usando `localStorage` por enquanto, já que é um protótipo).
- **Proteção de Rotas**: Adicionar um `beforeLoad` na rota raiz ou em rotas protegidas para redirecionar usuários não autenticados para `/login`.
- **Validação de Login**: Validar a matrícula contra a lista oficial de técnicos.

### 2. Qualidade de Código e Tipagem

- **Tipagem Estrita**: Substituir `any` por interfaces e tipos específicos em todos os componentes.
- **Componentização Shadcn**: Migrar inputs, selects, botões e tabelas nativas para os componentes do Shadcn UI já existentes no projeto (`@/components/ui/*`).
- **Feedback ao Usuário**: Integrar `sonner` para notificações de sucesso/erro (ex: ao registrar peça ou falha no login).

### 3. Correções e Melhorias no Dashboard

- **Insights da IA**: Refatorar o componente de insights para ser dinâmico com base no histórico real (mesmo que simulado).
- **Gráficos Recharts**: Corrigir avisos de acessibilidade e garantir responsividade em telas muito pequenas.
- **Gestão de Parques**: Garantir que a lógica de "Seabra 11" (aero incendiado) esteja consistente em todo o app.

### 4. Funcionalidades de Negócio

- **Histórico**: Adicionar paginação ou scroll infinito se a lista crescer muito.
- **Relatórios**: Validar a geração de PDF/Excel com dados reais do estado.
- **Scanner**: Melhorar o tratamento de erros e permissão de câmera.

## Detalhes Técnicos

- **Tecnologias**: TanStack Router, TanStack Query, Shadcn UI, Tailwind CSS.
- **Segurança**: Bloqueio de acesso via router context.
- **Performance**: Memoização de cálculos pesados de estatísticas.

---

_Vou começar pela implementação do sistema de autenticação e proteção de rotas._
