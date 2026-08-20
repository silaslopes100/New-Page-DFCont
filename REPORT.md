# DFCont — Relatório Final

## 1. Resumo 1

Revisão e correção da one page da DFCont (React 19 + Vite em `frontend/`, FastAPI em `backend/`). Todos os 10 itens do escopo foram implementados, com testes automatizados em ambos os lados.

**Status final:**
- Frontend: **27 testes passando** | lint OK | build OK
- Backend: **27 testes passando** | servidor rodando em `http://127.0.0.1:8000` (venv)

---

## 2. Itens entregues

### 2.1 Configuração central (novo)
- **`frontend/src/config/site.js`** — número oficial de WhatsApp (`5511945277005`), `buildWhatsAppUrl()` com texto pré-preenchido, `NAV_SECTIONS`, `NAV_LINKS`, `SERVICES_LINKS` e `scrollToSection()`. Todas as âncoras e CTAs do site passam a usar estas constantes (Hero, CTA, Footer, Plans, Sobre, Testimonials, Calculator).

### 2.2 Dropdown "Serviços" cortado — corrigido
- **Causa raiz:** `.glass-panel { overflow: hidden }` aplicado ao `.navbar-container`.
- **Fix (`Navbar.jsx`/`Navbar.css`):** glass separado em camada interna (`.navbar-glass`), container com `overflow: visible`, z-index 1000/1100. Dropdown funcional por **clique/toque + hover**, `aria-expanded/haspopup/controls`, teclado (Escape), clique-fora e fechamento automático ao navegar. Menu mobile com `min(300px, 85vw)`.

### 2.3 Aba "Empresas de Comércio" invisível — corrigido
- **Causa raiz:** cards com keys diferentes montavam com `animate-on-scroll` (`opacity: 0`) depois do mount; o `useScrollAnimation` só observava elementos existentes no load.
- **Fix (`useScrollAnimation.js`):** `MutationObserver` observa adições de nós e aplica a animação aos novos elementos.

### 2.4 Calculadora de planos — refatorada
- Validação por campo (nome, e-mail, telefone, atividade, rotina, contato) com mensagens e `role="alert"`.
- Máscara progressiva de telefone + validação de 10/11 dígitos com DDD.
- `Intl.NumberFormat('pt-BR', BRL)` para preços; benefícios vazios tratados.
- `Promise.allSettled`: lead + cálculo em paralelo; aviso se o lead falhar, resultado sempre exibido se o cálculo responder.
- Payload completo do lead para o e-mail (toggle, employees, routine, contact, benefits, plano, preço).
- Botão desabilitado durante loading ("Calculando..."), "Recalcular" reseta o fluxo.
- Background `bg-calculator.jpg` + overlay escuro.

### 2.5 Planos — a11y e WhatsApp
- Tabs com `role=tablist/tab/tabpanel`, `aria-selected/controls/labelledby`, navegação por setas/Home/End.
- Botões "Contratar" abrem WhatsApp oficial com contexto do plano.
- Background `bg-plans.jpg` + overlay; tabela comparativa com `min-width` + scroll horizontal no mobile.

### 2.6 WhatsApp oficial
- **Causa raiz:** botões apontavam para `#contato` ou número antigo.
- **Fix:** todos os CTAs (Hero "Fale conosco", CTA "Fale com um especialista", Plans, Calculator, Footer, contato no Contact) usam `https://wa.me/5511945277005?text=...` com `target="_blank" rel="noopener noreferrer"`.

### 2.7 Backend — lead + e-mail + contact
- **`email_service.py` (novo):** e-mail de notificação de lead com corpo contextual completo. Modos `console` (log, padrão dev) e `smtp` (starttls). Best-effort: nunca derruba a persistência.
- **`lead.py`:** novos campos opcionais (`toggle`, `employees`, `routine`, `contact`, `benefits`, `recommended_plan`, `monthly_price`); telefone normalizado para dígitos com validação 10–11.
- **`contact.py`:** telefone opcional — corrigido o **422** quando o formulário enviava telefone vazio.
- **`config.py`:** `EMAIL_MODE`, SMTP_*, `LEAD_NOTIFICATION_EMAIL` (default `silaslopesdesouza@gmail.com`); `.env.example` atualizado.

### 2.8 Responsividade (320–1024px)
- Navbar mobile, tabela de planos com scroll, grid do blog `minmax(min(320px,100%),1fr)`, ícones sociais do footer 40px (alvo de toque), dots dos depoimentos 16px, backgrounds com variante mobile.

### 2.9 Acessibilidade
- `:focus-visible` global, `scroll-margin-top` nas seções, `htmlFor`+`id` e `aria-invalid/describedby` nos campos do formulário, `aria-pressed` nos toggles, `aria-label` nos botões +/−.

### 2.10 Testes e build
- **Vitest + Testing Library** (novos devDeps): 5 suites, 27 testes — validações, máscara, fluxo da calculadora (erro/sucesso/loading/recalcular), tabs de planos (teclado), âncoras e WhatsApp.
- `npm run lint` (oxlint): sem erros novos (2 warnings pré-existentes: Modal.jsx e Hero.jsx).
- `npm run build`: OK (warning de chunk > 500 kB pré-existente, three.js).
- Backend: `pytest` com 27 testes, incluindo e-mail (console/smtp/falha) e contact sem telefone.

---

## 3. Como rodar

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm test           # vitest run
npm run lint
npm run build
```

### Backend
```bash
cd backend
python -m venv .venv   # (já criado; Python do sistema tinha pydantic corrompido)
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env # ajustar EMAIL_MODE e credenciais SMTP
.venv\Scripts\python -m uvicorn app.main:app --port 8000
.venv\Scripts\python -m pytest -q
```

> **Nota:** o servidor atualmente rodando (PID 7728, porta 8000) usa o `.venv` com `EMAIL_MODE=console` — e-mails aparecem no log do servidor.

### Configuração de e-mail (produção)
```env
EMAIL_MODE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
SMTP_FROM=seu-email@gmail.com
LEAD_NOTIFICATION_EMAIL=silaslopesdesouza@gmail.com
```

---

## 4. Pendências / observações

1. **Verificação visual em navegador** (desktop + mobile 320–1024px) não executada neste ambiente — recomendado teste manual antes do deploy.
2. Páginas do Footer (`/privacidade`, `/termos`, `/seguranca`) não existem no SPA — os links apontam para caminhos inexistentes (comportamento pré-existente).
3. `npm audit`: 1 vulnerabilidade alta pré-existente nas dependências.
4. Python do sistema está com ambiente corrompido (pydantic 2.9.2 + pydantic_core 2.18.2 incompatíveis) — usar sempre o `.venv` do backend.
5. Para produção: `DEBUG=false`, revisar `CORS_ORIGINS` e configurar SMTP real.

---

## 5. Arquivos alterados (resumo)

**Frontend:** `src/config/site.js` (novo), `src/utils/validation.js` (novo), `src/utils/format.js` (novo), `src/test/setup.js` (novo), testes (5 arquivos novos), `src/hooks/useScrollAnimation.js`, `src/components/common/Navbar/*`, `src/components/common/Input/Input.jsx`, `src/components/sections/Calculator/*`, `src/components/sections/Plans/*`, `src/components/sections/Hero/Hero.jsx`, `src/components/sections/CTA/CTA.jsx`, `src/components/sections/Contact/*`, `src/components/sections/Sobre/Sobre.jsx`, `src/components/sections/Testimonials/*`, `src/components/sections/Blog/Blog.css`, `src/components/common/Footer/*`, `src/styles/globals.css`, `public/bg-calculator.jpg`, `public/bg-plans.jpg`, `vite.config.js`, `package.json`.

**Backend:** `app/services/email_service.py` (novo), `app/core/config.py`, `app/api/models/lead.py`, `app/api/routes/lead.py`, `app/api/models/contact.py`, `app/api/routes/contact.py`, `app/services/lead_service.py`, `.env.example`, `tests/test_lead_email.py` (novo), `tests/test_contact.py`, `tests/conftest.py`, `.venv/` (novo).
