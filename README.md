## Cliente Gateway

## Dev

1. Clonar repositorio
2. Instalar dependencias
3. Crear archivo `.env` basado en `.env.template`
4. Tener levantado los microservicios que se van a consumir
5. Levantar el proyecto con `npm run start:dev`

## Nats
```
docker run -d --name nats-main -p 4222:4222 -p 8222:8222 nats
```