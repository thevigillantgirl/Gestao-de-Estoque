# Sistema de Autenticação e Cadastro Público

O sistema de Gestão de Estoque agora opera em um modelo de **Cadastro Aberto**, permitindo que novos usuários se registrem diretamente na plataforma.

## 🔓 Fluxos de Segurança e Acesso

### 1. Sistema de "Cadastro Aberto"
- **Registro Público**: Novos usuários podem criar suas próprias contas através da página de cadastro (`/register`).
- **Primeiro Admin**: O primeiro usuário a se cadastrar no sistema recebe automaticamente o perfil de `ADMIN`.
- **Controle de Acesso**: Usuários subsequentes recebem o perfil `USER` por padrão, podendo ter suas permissões alteradas por um administrador.

### 2. Painel Administrativo de Usuários (`/users`)
- Exclusivo para perfis `ADMIN`.
- **Listar e Filtrar**: Visualização rápida de todos os usuários do sistema.
- **Controle Total**: O administrador pode alterar cargos (`ADMIN` vs `USER`) e desativar usuários instantaneamente.

### 3. Auditoria e Logs Centralizados (`/logs`)
- Registro centralizado de eventos críticos para máxima segurança:
  - Sucesso e falha de login (incluindo motivo e IP).
  - Novos registros de usuários.
  - Alteração de permissões e status por administradores.
  - Logouts.

---

## 🛠️ Detalhes Técnicos (Backend)
- **Segurança**: Senhas criptografadas com `bcrypt` e autenticação via JWT (JSON Web Tokens).
- **Audit Helper**: Serviço centralizado que garante o rastreamento de todas as ações importantes.
- **Modelos**: Tabela `User` unificada com suporte a diferentes níveis de permissão.

---
**O sistema está configurado para um crescimento escalável com segurança e auditoria completa.**

