---
name: cervejaria-completa
user-invocable: true
description: "Crie uma aplicação completa com tema de cervejaria: Cervejas, Estilos e Fornecedores, incluindo relatório com JOIN entre Cervejas e Estilos."
---

# Skill: Criar aplicação completa de cervejaria

## Objetivo

Gerar um projeto completo de gestão de cervejaria com as entidades:
- `Cervejas`
- `Estilos`
- `Fornecedores`

E um relatório que mostre as cervejas com os dados do estilo usando um JOIN entre `Cervejas` e `Estilos`.

## Quando usar

Use este skill quando o usuário pedir uma aplicação completa de cervejaria com:
- CRUD para todas as entidades
- modelo relacional entre cervejas e estilos
- relatório de cervejas com estilo
- interface simples e instalação documentada

## Passos do fluxo

1. Confirmar se há preferência de stack ou arquivos existentes no workspace.
   - Se já existir React/JSX, prefira React para frontend.
   - Caso contrário, escolha um stack simples de JavaScript/TypeScript com backend e frontend.
2. Definir o modelo de dados:
   - `Cervejas`: id, nome, teor_alcoolico, preco, estoque, estilo_id, fornecedor_id, descricao
   - `Estilos`: id, nome, descricao
   - `Fornecedores`: id, nome, contato, telefone, email, endereco
3. Criar backend/API com CRUD para cada entidade e endpoints de listagem.
4. Criar frontend com:
   - páginas/listagens de Cervejas, Estilos e Fornecedores
   - formulários de criação/edição
   - relatório com JOIN entre Cervejas e Estilos
5. Adicionar documentação de execução:
   - instalação
   - comandos para iniciar backend e frontend
   - exemplo de carga inicial de dados

## Critérios de conclusão

- Projeto completo com backend e frontend funcionando
- Relacionamento entre `Cervejas` e `Estilos` implementado
- Relatório exibindo `nome da cerveja`, `nome do estilo` e outros detalhes
- Código comentado e instalável
- Estrutura de arquivos clara e condizente com o stack escolhido
