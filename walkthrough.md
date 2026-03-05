# ERP Expansion - Gestão de Estoque

I have successfully expanded the ERP system with all requested features, maintaining the original design while adding robust enterprise functionalities.

## 🚀 Novas Funcionalidades Implementadas

### 🔐 Autenticação e Segurança (RBAC)
- **Sistema de Login**: Tela de login dedicada com autenticação JWT.
- **Níveis de Acesso**: Implementação de perfis `ADMIN` e `USER`.
- **Proteção de Rotas**: Todas as operações críticas agora exigem autenticação e verificam permissões.
- **Persistência**: Sessão mantida localmente com revalidação automática.

### 📊 Relatórios e BI (Nova Página)
- **Dashboard Interativo**: Visualização de métricas em tempo real.
- **Gráficos (Recharts)**:
    - **Evolução de Estoque**: Entradas vs Saídas nos últimos 7 dias.
    - **Top Produtos**: Ranking por nível de estoque.
    - **Distribuição por Categoria**: Valor total do inventário segmentado.

### 📋 Auditoria e Histórico (Novas Páginas)
- **Logs de Acesso**: Rastreamento detalhado de ações por usuário, IP e evento (exclusivo para Admins).
- **Histórico de Produtos**: Trilha de auditoria individualizada para cada SKU, facilitando a conferência de estoque.

### 📦 Gestão Avançada de Inventário
- **Categorização**: Novo campo de categoria adicionado a todos os produtos.
- **Importação/Exportação CSV**: Ferramentas para carga massiva e backup do catálogo de produtos.
- **Alertas de Estoque**: Sistema de monitoramento que identifica itens abaixo do mínimo.
- **Configurações de Alerta**: Nova página para configurar o destinatário dos e-mails de alerta.

### 🔍 Experiência do Usuário (UX)
- **Busca Global**: Barra de pesquisa no Topbar com resultados inteligentes para Produtos e Fornecedores.
- **Dark/Light Mode**: Implementação completa do tema escuro com persistência de preferência.
- **Vistas Detalhadas**: Modais expandidos para Fornecedores e Pedidos de Compra.

## 🛠️ Tecnologias Adicionadas
- **Backend**: `passlib`, `python-jose` (Segurança), `sqlalchemy` logic (Reports).
- **Frontend**: `recharts` (Gráficos), `date-fns` (Datas), `AuthContext` (Estado Global).

## 🏁 Como Testar
1. **Login**: Use as credenciais cadastradas (ou o setup inicial de admin).
2. **Dashboard**: Acesse a aba "Relatórios" para ver os novos gráficos.
3. **Busca**: Use a barra superior para encontrar qualquer item instantaneamente.
4. **CSV**: Na página de Produtos, utilize os botões de Importar/Exportar.
5. **Configurações**: Como admin, configure o e-mail de alertas na aba de Administração.

---
*O sistema está pronto para uso em ambiente de produção com os novos controles de segurança e visibilidade de dados.*
