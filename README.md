## Create env file
```env
SACRA_LIVING_HERO_BOT=
SACRA_DEAD_HERO_BOT=
SACRA_ITEMS_BOT=
SACRA_BROKEN_ITEMS_BOT=
SACRA_USER_BOT=
SACRA_HERO_FINISH_FIRST_BIOME_BOT=
SACRA_HERO_FINISH_SECOND_BIOME_BOT=
GUILD_ID=
SACRA_SUBGRAPH_URL=
```
## Run Dockerfile

```bash
docker build -t bot .
docker run -d bot
```

## Run docker-compose

```
docker-compose up --build -d
```