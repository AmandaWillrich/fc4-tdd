# Desafio Técnico: Desenvolvimento Orientado a Testes (TDD)

Este repositório contém a solução para um desafio técnico focado na implementação de funcionalidades em um sistema de reservas de propriedades, utilizando a metodologia de Desenvolvimento Orientado a Testes (TDD).

## Objetivo do Desafio

O objetivo principal foi implementar uma série de testes para guiar o desenvolvimento das funcionalidades do sistema. A suíte de testes desenvolvida cobre as seguintes áreas:

-   **Testes de Mappers:** Validação da conversão entre entidades de domínio e de persistência.
-   **Criação via API REST:** Testes end-to-end (E2E) para a criação de **Usuários (Guests)** e **Propriedades**.
-   **Políticas de Reembolso:** Testes de unidade para a fábrica de regras de cancelamento (`RefundRuleFactory`), validando os diferentes cenários de reembolso.
-   **Serviços de Domínio:** Testes para a lógica de negócio, como o serviço de cancelamento de reservas.

## Como Validar a Solução

O foco principal deste desafio é a suíte de testes. Para executar todos os testes (unitários e E2E) e verificar a corretude e a cobertura das implementações, utilize o comando abaixo.

```bash
npm test
```

Para gerar e visualizar o relatório de cobertura de testes:

```bash
npm test -- --coverage
```

## Configuração do Ambiente

Siga os passos abaixo para configurar o projeto localmente.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [npm](https://www.npmjs.com/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/AmandaWillrich/fc4-tdd.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd fc4-tdd
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

## Tecnologias Utilizadas

-   **Node.js**: Ambiente de execução.
-   **TypeScript**: Linguagem principal do projeto.
-   **Express.js**: Framework para a construção da API REST.
-   **TypeORM**: ORM para interação com o banco de dados.
-   **Jest**: Framework para a escrita e execução dos testes.
-   **Supertest**: Biblioteca para testes E2E dos endpoints HTTP.
-   **SQLite**: Banco de dados em memória utilizado para os testes, garantindo rapidez e isolamento.