# Plano de Responsividade Total - Gestão de Sobressalentes

Este plano visa tornar toda a aplicação 100% responsiva, garantindo uma experiência fluida em dispositivos móveis, tablets e desktops, sem comprometer as funcionalidades existentes.

## Alterações de Interface e Design

### Layout Global e Navegação

- **Sidebar Mobile**: Transformar a sidebar lateral em um menu "Sheet" (gaveta) no mobile, acionado por um botão hambúrguer.
- **Header Adaptável**: Adicionar um header fixo no mobile para conter o acionador do menu e o título da página.
- **Containers**: Ajustar paddings e margens para telas pequenas (reduzir de `p-8` para `p-4` no mobile).

### Dashboard e Cards

- **Grid de Estatísticas**: Alterar de `grid-cols-4` para `grid-cols-1` no mobile e `grid-cols-2` em tablets.
- **Gráficos**: Garantir que os containers de Recharts usem `ResponsiveContainer` com altura fixa menor no mobile para evitar overflow vertical excessivo.
- **Insights da IA**: Ajustar o layout do card de insights para empilhar conteúdo e botão verticalmente em telas estreitas.

### Formulário de Movimentação

- **Inputs e Selects**: Garantir que ocupem 100% da largura disponível.
- **Barcode Scanner**: Ajustar o tamanho do modal do scanner e a área de visualização da câmera para se adequar a telas de celular.

### Tabela de Histórico

- **Tabela Responsiva**: Implementar `overflow-x-auto` no container da tabela.
- **Visibilidade de Colunas**: Ocultar colunas menos críticas (como WO ou Estoque) em telas muito pequenas, permitindo visualização via clique ou expansão.

## Detalhes Técnicos

- Utilizar classes utilitárias do Tailwind CSS (`sm:`, `md:`, `lg:`, `xl:`) para controlar o comportamento em diferentes breakpoints.
- Substituir quaisquer valores de largura/altura fixos (ex: `w-[400px]`) por valores relativos ou baseados em grid (`w-full`, `max-w-md`).
- Revisar `src/components/ui/` para garantir que componentes base como `Card`, `Input` e `Button` não possuam restrições de largura que quebrem o layout.
- Garantir que o `jspdf` e `xlsx` continuem funcionando após as mudanças de layout (geralmente não são afetados por CSS, mas a interface de exportação sim).

## Verificação

- Testar emulando dispositivos no Chrome DevTools (iPhone SE, iPad, Desktop 1080p).
- Verificar se o menu mobile fecha corretamente após a navegação.
- Confirmar se o formulário de registro é preenchível sem zoom excessivo ou deslocamento horizontal.
