# Love Tickets 💌

Sistema simples para controlar tickets de presentes românticos impressos. Cada ticket tem um
QR Code exclusivo que leva a uma página pública elegante, com um tema visual diferente para
cada tipo de presente (cinema, hambúrguer, praia, jantar, massagem, viagem...).

Cada usuário tem sua própria conta e só vê, edita e gerencia os próprios tickets — os de
outras contas ficam isolados, garantido pelo banco (Row Level Security), não só pela tela.

Não é um sistema de venda de ingressos, pagamentos ou eventos — apenas geração de QR Code,
validação e exibição de status (disponível / utilizado).

## Stack

Next.js 15 (App Router) · TypeScript · TailwindCSS · Supabase (banco + auth + storage) ·
shadcn/ui · Framer Motion

## 1. Configurar o Supabase

1. Use o projeto Supabase já configurado (URL e chave abaixo) ou crie o seu em
   https://supabase.com.
2. Vá em **SQL Editor** e rode o conteúdo do arquivo `supabase/schema.sql` deste projeto.
   Isso cria a tabela `tickets` (com a coluna `user_id`), o bucket de storage `tickets`
   (imagens de capa) e as políticas de acesso (RLS) descritas abaixo.
   > Idempotente: se você já tinha rodado uma versão anterior, pode rodar de novo sem
   > problema.
3. Em **Settings → API**, copie a **Project URL** e a **anon / publishable key**
4. (Recomendado) Em **Authentication → Sign In / Providers → Email**, desative a opção
   **"Confirm email"**. Assim, quando alguém se cadastrar pelo `/signup`, já consegue entrar
   na hora — sem isso, o Supabase manda um e-mail de confirmação antes de liberar o login.

### Como ficam as permissões no banco (RLS)

| Ação | Quem pode |
|---|---|
| Ver um ticket (`/ticket/CODIGO`) | Qualquer pessoa — com ou sem conta |
| Ver a lista de tickets no dashboard (`/menu`) | Só o próprio dono, e só os dele (filtrado por `user_id`) |
| Criar ticket | Usuário autenticado (o `user_id` é preenchido automaticamente com `auth.uid()`) |
| Editar / Excluir ticket | Só o dono do ticket |
| Marcar como utilizado / Reativar | Só o dono do ticket |

Isso é garantido pelas *policies* do Postgres (Row Level Security), então vale mesmo que
alguém tente chamar a API do Supabase diretamente, sem passar pela tela.

## 2. Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000/signup para criar sua conta (nome, e-mail e senha — sem convite).
Depois disso, entre por http://localhost:3000/login sempre que precisar.

## Fluxo de login e permissões

- **Cadastro** (`/signup`) e **login** (`/login`) usam a autenticação nativa do Supabase — sem
  código de convite, qualquer pessoa pode criar a própria conta.
- **Menu** (`/menu`) é protegido pelo `middleware.ts`: sem login, redireciona para
  `/login`. Cada conta só vê os próprios tickets.
- **Página pública do ticket** (`/ticket/CODIGO`) é sempre visível a qualquer pessoa que abra o
  link ou escaneie o QR Code — com conta, sem conta, ou logado em outra conta. Ela mostra
  nome, descrição, imagem, status e data — nunca permite alterar nada por padrão.
- **Se você (dono) estiver logado** e abrir o link do seu próprio ticket, aparece um botão
  extra "Marcar como Utilizado" / "Reativar Ticket" bem ali na página — não precisa abrir o
  dashboard pra isso.
- **Se você não estiver logado** e abrir um ticket, aparece um link discreto "Entrar como
  proprietário" no rodapé do ticket. Ele leva para o `/login` e, depois de autenticar, volta
  automaticamente para a mesma página do ticket que você estava vendo.
- **Se você estiver logado, mas o ticket não for seu**, a página se comporta como se você
  fosse um visitante comum: só visualização, nenhum botão de ação aparece.

## Como usar

1. Crie sua conta em `/signup` (ou entre em `/login` se já tiver uma).
2. No **Menu** (`/menu`), clique em **Criar Ticket**: informe título, descrição, escolha o
   **tema** da página pública (isso define o "mundo" que a pessoa vê ao escanear — cinema,
   hambúrguer, praia, jantar, massagem, viagem ou genérico) e envie a imagem de capa.
3. Ao salvar, o sistema gera automaticamente um **código único**, o **link** e o **QR Code**,
   já associados à sua conta.
4. Use as abas **Todos / Disponíveis / Utilizados** para filtrar sua lista.
5. Cada ticket tem um menu (ícone "⋮" no canto do card) com: **Editar Ticket**, **Baixar QR
   Code** (PNG pra colocar no ticket físico impresso — a arte é por sua conta, como
   combinado), **Marcar como Utilizado** / **Reativar Ticket**, e **Excluir Ticket**.
6. Quando o presente for usado, marque como utilizado pelo menu do dashboard **ou** direto na
   página pública do ticket (se estiver logado como dono) — ela passa a mostrar o carimbo
   "UTILIZADO" em vermelho, com data e hora.
7. No menu de conta (seu nome, no canto superior direito), dá pra trocar a senha ou sair.

## Estrutura

```
app/
  menu/                  → menu / dashboard (/menu), protegido, só tickets do usuário logado
    actions.ts            → server actions (criar, editar, excluir, marcar/reativar),
                             todas exigem login e checam dono do ticket
    page.tsx
  login/                  → tela de login (/login), aceita ?redirectTo=
  signup/                 → tela de cadastro (/signup), sem convite
  ticket/[codigo]/        → página pública do ticket (/ticket/CODIGO)
middleware.ts             → protege /menu, redireciona pra /login se não estiver logado
components/
  admin/                  → formulário, cartão de ticket (menu de ações), dashboard com
                             abas de filtro, menu de conta (trocar senha / sair)
  ticket/                 → cenário temático + "stub" do ticket VIP + carimbo
  ui/                      → componentes shadcn/ui (button, dialog, dropdown-menu...)
lib/
  temas.ts                → configuração visual de cada tema (cinema, praia, etc.)
  types.ts                → tipos do Ticket (inclui user_id)
  supabase/                → clientes Supabase (browser, server, com sessão de login)
supabase/schema.sql        → schema do banco + storage + políticas de isolamento por usuário
```

## Nota sobre a tabela

O banco pedido tinha as colunas `id, codigo, titulo, descricao, imagem, status, utilizado_em,
created_at`. Adicionei duas colunas extras:
- `tema` (texto, padrão `'generico'`) — define o visual da página pública por tipo de presente.
- `user_id` (uuid, referencia `auth.users`) — dono do ticket, preenchido automaticamente com
  `auth.uid()` na criação. É a base do isolamento entre usuários.

Se você já tinha tickets criados antes dessa coluna existir, eles ficam com `user_id` vazio até
você associá-los manualmente a uma conta — rode no SQL Editor:

```sql
update public.tickets set user_id = 'UUID-DO-USUARIO' where user_id is null;
```

(pegue o UUID em **Authentication → Users** no painel do Supabase).

## Personalizar temas

Cada tema (cor de fundo, ambientação animada) está em `lib/temas.ts` e
`components/ticket/theme-stage.tsx`. Para adicionar um novo tema (ex: "spa", "aniversário"),
basta:
1. Adicionar o valor em `TicketTema` (`lib/types.ts`).
2. Adicionar a entrada em `TEMAS` (`lib/temas.ts`) e `TEMA_LABELS` (`lib/types.ts`).
3. Criar um componente de ambientação em `theme-stage.tsx` e registrá-lo no objeto `AMBIENCE`.
