# Stack: Next(front end e back end), postgresql
## Extras: aws s3 e aws ec2

````
# Configuração do Ambiente(defina as variáveis antes de startar a aplicação)

Crie um arquivo `.env` com as seguintes variáveis:

```env
ADMIN_PASSWORD=port@lnordeste1
ADMIN_NAME=Portal ne1

API_URL=https://www.portalne1.com/api

NEXTAUTH_SECRET=uma secret aqui
NEXTAUTH_URL=https://www.portalne1.com

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=portal
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/portal

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=
````

---

## Importante

* Prefira usar o S3 da AWS, caso não queira gerenciar armazenamento diretamente na infraestrutura da aplicação(recomendo para não pesar tanto o servidor e mais fácil gerenciar backups).

* A aplicação não foi preparada para migração dinâmica de URLs. Atualmente, os arquivos estão armazenados com caminho absoluto no banco, por exemplo:

```
https://portal-nordeste-1.s3.amazonaws.com/posts/9bfe0f56-7dae-4962-af94-e9a298e2e9af.jpg
```

* Observe que `https://portal-nordeste-1.s3.amazonaws.com` está fixo no banco. Ao migrar a aplicação, será necessário atualizar a base URL manualmente.

---

## Estrutura do Projeto

A aplicação foi desenvolvida em poucos dias e não está totalmente componentizada.

* Caso pretenda fazer muitas alterações estruturais, recomenda-se refatorar e componentizar antes.
* Caso contrário, mudanças diretas podem gerar retrabalho e aumentar a complexidade de manutenção.

---

## Deploy Automatizado

O projeto já possui um workflow de deploy configurado via GitHub Actions. Basta configurar corretamente os secrets no repositório:

* EC2_HOST
* EC2_USER
* EC2_SSH_KEY
* EC2_PROJECT_PATH

### Workflow

```yaml
name: Push-Portal

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            set -e

            cd ${{ secrets.EC2_PROJECT_PATH }}

            git pull origin main

            docker compose down
            docker system prune -af
            docker compose up -d --build

            docker compose exec -T portal npx drizzle-kit migrate

            echo "Deploy finalizado"
```

---

## Docker Compose

```yaml
version: "3.8"

services:
  portal:
    build: .
    container_name: portal
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    container_name: postgres
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres-data:
```

---

## URL da Aplicação

```
https://www.portalne1.com
```
