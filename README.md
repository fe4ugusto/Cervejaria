# Cervejaria Completa

Aplicação de gestão de cervejaria com cadastro de:
- Cervejas
- Estilos
- Fornecedores

Inclui relatório com JOIN entre `Cervejas` e `Estilos`.

## Como usar

1. Instale dependências:
   ```bash
   npm install
   ```
2. Inicie o projeto:
   ```bash
   npm run dev
   ```
3. Abra o endereço mostrado no terminal.

## Login

Use o usuário padrão:
- E-mail: `admin@cervejaria.com`
- Senha: `1234`

## Estrutura

- `src/App.jsx` — app completo com CRUD e relatório
- `src/main.jsx` — entrada do Vite
- `index.html` — página principal
- `package.json` — dependências e scripts

## Observações

- Os dados são salvos no `localStorage` do navegador.
- O relatório combina `cervejas`, `estilos` e `fornecedores` usando relacionamento por `id`.
