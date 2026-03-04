# Luis Development Hub

Portfólio pessoal de **Luís Arthur**, desenvolvedor web FullStack. O projeto apresenta habilidades, projetos, serviços freelancer e um sistema de dashboard administrativo demonstrativo — tudo construído com HTML, CSS e JavaScript puro, sem frameworks.

## Páginas

| Arquivo | Descrição |
|---|---|
| `index.html` | Portfólio principal (Home, Sobre, Projetos, Serviços, Contato) |
| `login.html` | Tela de login para acesso ao dashboard (modo demo) |
| `dashboard.html` | Painel administrativo com mensagens, usuários e cargos |

## Funcionalidades

### Portfólio (`index.html`)
- **Hero** com foto, descrição e links para redes sociais
- **Sobre Mim** com barras de progresso de habilidades (HTML, CSS, JS, Go, Git, Lua, TypeScript)
- **Projetos** em cards com preview, descrição e tags de tecnologia
- **Serviços** em 3 pacotes (Starter R$150 / Professional R$300 / Advanced R$600) com link direto para WhatsApp
- **Contato** via WhatsApp (formulário accordion) e mensagem direta (salva no dashboard)
- Menu mobile responsivo com toggle hamburger/fechar

### Dashboard (`dashboard.html`)
- **Visão Geral** com cards de estatísticas e mensagens recentes
- **Mensagens** — caixa de entrada com marcação de lidas/não lidas e exclusão
- **Usuários** — criação e exclusão de usuários com atribuição de cargo
- **Cargos** — criação de cargos com permissões granulares (visualizar, criar, editar, excluir, notificações)
- Sidebar responsiva com overlay mobile
- Notificações do navegador (Browser Notifications API)

### Sistema de dados (`javascript/db.js`)
Banco de dados client-side baseado em `localStorage`. Gerencia:
- Usuários, cargos e mensagens via CRUD completo
- Mensagens de exemplo pré-carregadas na primeira visita
- Marcação de leitura com autor e timestamp

> **Aviso:** Os dados são armazenados em texto simples no `localStorage` do navegador. Este é um sistema demonstrativo — não insira informações sensíveis reais.

## Acesso Demo

```
E-mail:  preview@luisdevhub.com
Senha:   preview123
```

## Tecnologias

- HTML5 / CSS3 / JavaScript ES6+
- [Font Awesome 6.5](https://fontawesome.com/) (ícones via CDN)
- `localStorage` (persistência de dados client-side)
- Browser Notifications API

## Estrutura de arquivos

```
luisdevhub/
├── index.html
├── login.html
├── dashboard.html
├── css/
│   ├── style.css        # Estilos globais e portfólio
│   ├── login.css        # Estilos da tela de login
│   └── dashboard.css    # Estilos do painel administrativo
├── javascript/
│   ├── db.js            # Banco de dados (localStorage)
│   ├── auth.js          # Autenticação e sessão
│   ├── login.js         # Lógica da tela de login
│   ├── dashboard.js     # Lógica do painel
│   └── script.js        # Scripts do portfólio (menu, formulários)
└── images/
    ├── logo.png
    ├── Luis.jpeg
    ├── fivem-preview.png
    └── ...
```

## Como executar

Abra o `index.html` diretamente no navegador — não requer servidor ou dependências externas.

## Contato

- **LinkedIn:** [luisarthurrib](https://www.linkedin.com/in/luisarthurrib/)
- **GitHub:** [LuisArthurDev](https://github.com/LuisArthurDev)
- **Discord:** [Entrar no servidor](https://discord.gg/zGf2XJxj7g)
