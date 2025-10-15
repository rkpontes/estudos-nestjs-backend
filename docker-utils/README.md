# PostgreSQL 16 para conceitos_nest

Este `docker-compose.yml` sobe um PostgreSQL 16 pronto para ser consumido tanto pela aplicação `conceitos_nest/` quanto por ferramentas locais.

## Uso

```bash
docker compose up -d
```

Se preferir parar os serviços:

```bash
docker compose down
```

Os dados ficam persistidos no volume nomeado `conceitos_nest_pg_data`.

## Dados de conexão

- Host: `localhost`
- Porta: `5432`
- Banco: `conceitos_nest`
- Usuário: `conceitos_nest`
- Senha: `conceitos_nest`

Dentro da aplicação `conceitos_nest/`, configure a conexão apontando para `localhost:5432`.
