# 📦 Gestão de Estoque - ERP Full Stack

Sistema de gestão de estoque moderno e escalável, desenvolvido com FastAPI (Backend) e React (Frontend).

## 🚀 Estrutura do Projeto

O projeto segue uma arquitetura profissional separando claramente as responsabilidades:

- **`/backend`**: API RESTful desenvolvida com FastAPI, SQLAlchemy e SQLite.
- **`/frontend`**: Interface Single Page Application (SPA) com React, Vite e TailwindCSS.

---

## 🛠️ Como Rodar o Projeto

### 1. Backend (API)
Navegue até a pasta do backend, ative o ambiente virtual e inicie o servidor:

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt  # Caso precise atualizar dependências
python -m uvicorn app.main:app --reload
```
A API estará disponível em: `http://localhost:8000`

### 2. Frontend (Interface)
Em um novo terminal, navegue até a pasta do frontend e inicie o servidor de desenvolvimento:

```bash
cd frontend
npm install  # Caso seja a primeira vez ou novas dependências
npm run dev
```
O sistema estará disponível em: `http://localhost:5173`

---

## 🎨 Funcionalidades Principais
- **Dashboard**: KPIs em tempo real e alertas de estoque baixo.
- **Produtos**: Cadastro completo com controle de SKU e preços.
- **Fornecedores**: Gestão de parceiros comerciais.
- **Movimentação**: Registro de entradas, saídas e ajustes de estoque.
- **Pedidos de Compra**: Fluxo completo de aprovação e recebimento.
- **Integrações**: Sistema de Webhooks (Outbox Pattern) pronto para automação (n8n, Zapier).

---

## 🛡️ Desenvolvimento
- **Lints**: ESLint (Frontend) / Pyright (Backend).
- **Design**: TailwindCSS com suporte nativo a **Dark Mode**.
- **Segurança**: CORS configurado para ambiente de desenvolvimento.

---
Desenvolvido com carinho para eficiência operacional. 🚀
