# Sistema de Autenticação Avançada e Gestão de Usuários

O sistema de Gestão de Estoque foi atualizado para um modelo de "Cadastro Fechado", ideal para ambientes corporativos controlados.

## 🔒 Novos Fluxos de Segurança

### 1. Sistema de "Cadastro Fechado"
- O sistema agora é totalmente restrito. Apenas usuários cadastrados pelou administrador podem acessar.
- **Solicitar Acesso**: Usuários sem conta podem preencher um formulário de solicitação (`/request-access`).

### 2. Notificações do Administrador
- Toda nova solicitação dispara um e-mail automático para o administrador (`rochamarialuiza591@gmail.com`).
- O e-mail contém os dados do solicitante (Nome, Empresa, Motivo) e instruções para aprovação.

### 3. Painel Administrativo de Usuários (`/users`)
- Exclusivo para perfis `ADMIN`.
- **Listar e Filtrar**: Visualização rápida de todos os usuários do sistema.
- **Controle Total**: O administrador pode criar novas contas, alterar cargos (`ADMIN` vs `USER`) e desativar usuários instantaneamente.

### 4. Gestão de Solicitações (`/access-requests`)
- Interface para revisar solicitações pendentes.
- **Aprovar/Rejeitar**: Processamento organizado de novos acessos.

### 5. Auditoria e Logs Reforçados (`/logs`)
- Registro centralizado de eventos críticos:
  - Sucesso e falha de login (incluindo motivo e IP).
  - Criação e alteração de usuários.
  - Solicitações de acesso recebidas e revisadas.
  - Logouts.

---

## 🛠️ Detalhes Técnicos (Backend)
- **Email**: Integrado via SMTP (Gmail) usando variáveis de ambiente (`.env`).
- **Audit Helper**: Serviço centralizado para garantir que toda ação importante seja logada uniformemente.
- **Modelos**: Novas tabelas `AccessRequest` e atualizações em `User` (campo `name`).

## ⚙️ Configuração (Variáveis de Ambiente)
Certifique-se de configurar o arquivo `.env` baseado no novo `.env.example`:
- `SMTP_USER`: Seu e-mail (pref. Gmail).
- `SMTP_PASS`: Senha de App (Gerada no Google Account).
- `EMAIL_ADMIN_TO`: E-mail que receberá as notificações (`rochamarialuiza591@gmail.com`).

---
**O sistema agora está pronto para uma operação segura e auditável.**
