# Golden Raspberry Awards API

API em NestJS para análise de produtores com maior e menor intervalo entre vitórias na categoria **Pior Filme**.

---

## 🚀 Tecnologias utilizadas

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/en)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?logo=typeorm&logoColor=white)](https://typeorm.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/index.html)
[![better-sqlite3](https://img.shields.io/badge/better--sqlite3-0B7285?logo=sqlite&logoColor=white)](https://github.com/WiseLibs/better-sqlite3)
[![Winston](https://img.shields.io/badge/Winston-231F20?logo=github&logoColor=white)](https://github.com/winstonjs/winston)
[![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=1A2B34)](https://prettier.io/)

---

## 📦 Pré-requisitos

- Node.js **20+**
- npm **10+**

> Observação: o projeto usa banco em memória (`better-sqlite3`), sem necessidade de instalar SGBD local.

---

## ▶️ Manual de inicialização da API (passo a passo)

### 1) Clonar e acessar o projeto

```bash
git clone https://github.com/edufsantos/golden-raspberry-awards-api
cd api
```

### 2) Instalar dependências

```bash
npm install
```

### 3) Configurar variáveis de ambiente

Este projeto valida ambiente no bootstrap. Garanta as variáveis abaixo:

| Variável    | Exemplo                        | Obrigatória | Descrição                    |
| ----------- | ------------------------------ | ----------- | ---------------------------- |
| `NODE_ENV`  | `development`                  | Sim         | Ambiente de execução         |
| `PORT`      | `3000`                         | Sim         | Porta da API                 |
| `LOG_LEVEL` | `log,warn,error,debug,verbose` | Sim         | Níveis habilitados no logger |

Exemplo (macOS/Linux):

```bash
export NODE_ENV=development
export PORT=3000
export LOG_LEVEL=log,warn,error,debug,verbose
```

### 4) Rodar em modo desenvolvimento

```bash
npm run start:dev
```

API disponível em:

```text
http://localhost:3000
```

### 5) Endpoints para validar rápido

- `GET /` → retorna `Hello World!`
- `GET /producers/awards-interval` → retorna intervalos mínimo e máximo de vitórias por produtor

### 6) Rodar testes

```bash
# unitários
npm run test

# e2e
npm run test:e2e

# cobertura
npm run test:cov
```

### 7) Build e produção

```bash
npm run build
npm run start:prod
```

---

## 🌐 CORS

O CORS está restrito para:

```text
http://localhost:5173
```

Isso permite integração local com frontend (ex.: Vite) nesta origem.

---

## 🧠 Regra de negócio principal

O endpoint `GET /producers/awards-interval`:

1. Busca filmes vencedores.
2. Agrupa anos de vitória por produtor.
3. Calcula intervalos entre vitórias consecutivas.
4. Retorna os produtores com menor (`min`) e maior (`max`) intervalo.

Formato de resposta:

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

---

## 🏗️ Arquitetura escolhida (por camadas e pastas)

Arquitetura modular em camadas, com foco em separação de responsabilidades.

### Responsabilidade de cada pasta

- **`src/`**
  - Bootstrap da aplicação e composição dos módulos principais.

- **`src/common/`**
  - Recursos transversais compartilhados (configuração, constantes, logger e utilitários globais).

- **`src/infra/`**
  - Implementações técnicas de infraestrutura (banco, entidades e repositórios).

- **`src/modules/`**
  - Regras de negócio e casos de uso por domínio funcional (ex.: producers, movies, data-loader).

- **`src/shared/`**
  - Arquivos estáticos compartilhados entre módulos (ex.: CSV de carga inicial).

- **`test/`**
  - Testes de integração/e2e e validação de contrato da API.

### Como as camadas devem se comunicar

Fluxo esperado:

1. **Controller (`modules`)** recebe requisição HTTP.
2. **Service (`modules`)** executa regra de negócio.
3. **Repository (`infra`)** realiza acesso a dados.
4. **Entity (`infra`)** representa o modelo persistido.

Regras de comunicação:

- `modules` **pode depender** de `infra` e `common`.
- `infra` **não deve depender** de `modules`.
- `common` deve ser **agnóstico de domínio** (sem regra de negócio de `movies`/`producers`).
- `shared` deve conter apenas **recursos estáticos** (sem lógica).
- Controllers devem ser finos: apenas entrada/saída HTTP; regra fica nos services.
- Acesso ao banco deve acontecer via repositórios/serviços de infraestrutura, não direto no controller.

---

## ✅ Resumo de responsabilidades por camada

- **Controller**: recebe requisições HTTP e retorna respostas.
- **Service**: aplica regras de negócio e orquestra fluxos.
- **Repository**: encapsula acesso a banco.
- **Entity**: modela tabelas e relacionamentos.
- **Common**: logging, validação e configurações compartilhadas.
- **Infra**: recursos técnicos de persistência e integração.

---

Feito com carinho por Edu <3
