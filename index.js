const { Client }    = require('discord.js');
const StatusUpdater = require('@tmware/status-rotate');
const axios         = require('axios');
const dotenv        = require('dotenv');
dotenv.config();

// 10 min
const DELAY_MS           = 600000;
const GUILD_ID           = process.env.GUILD_ID;
const SACRA_SUBGRAPH_URL = process.env.SACRA_SUBGRAPH_URL;

const USER_QUERY = `
  query {
    userEntities(
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const HERO_FINISH_FIRST_BIOME_QUERY = `
  query {
    heroEntities(
      where: { maxBiomeCompleted_gt: 0 }
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const HERO_FINISH_SECOND_BIOME_QUERY = `
  query {
    heroEntities(
      where: { maxBiomeCompleted_gt: 1 }
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const HERO_FINISH_THIRD_BIOME_QUERY = `
  query {
    heroEntities(
      where: { maxBiomeCompleted_gt: 2 }
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const HERO_REINFORCEMENT_QUERY = `
  query {
    heroEntities(
      where: { staked: true }
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const LIVING_HERO_QUERY = `
  query {
    heroEntities(
      where: { owner_not:"0x0000000000000000000000000000000000000000" }
      skip: $skip
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const DEAD_HERO_QUERY = `
  query {
    heroEntities(
      where: { owner:"0x0000000000000000000000000000000000000000" }
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const ITEM_QUERY = `
  query {
    itemEntities(
      where: {burned: false}
      first: 1000
      skip: $skip
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

const DESTROYED_ITEM_QUERY = `
  query {
  itemEntities(
    first: 1000
    skip: $skip
    orderBy: id
    orderDirection: asc
    where: {burned: true}
  ) {
    id
  }
  }
`;

async function fetchData (query, entityType, lastIdField, url) {
  console.log('Start fetching data for ', url);
  let allData = [];

  let skipPages = 0;
  while (true) {
    const paginatedQuery = query.replace('$skip', (skipPages * 1000).toFixed());
    try {
      const response = await axios.post(url, {
        query: paginatedQuery,
      });
      const data     = response.data;
      const entities = data.data[entityType];

      if (entities.length === 0) {
        console.log(`Finish ${entityType} ${allData.length}`)
        break;
      }

      allData = allData.concat(entities);
      skipPages++;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  console.log('Data fetched!');
  return allData;
}

async function runBotWithDescription(token, nickname, description, query, entityType) {
  console.log('runBot')
  const bot         = new Client({ intents: [] });
  bot.statusUpdater = new StatusUpdater(bot);
  bot.login(token);

  const guild = await bot.guilds.fetch(GUILD_ID);
  bot.once('ready', () => updateStatus(bot, guild, nickname, description, query, entityType, 'id'));
}

async function runBot(token, nickname, query, entityType) {
  runBotWithDescription(token, nickname, nickname, query, entityType)
}

async function updateStatus(bot, guild, nickname, description, query, entityType, lastIdField) {
  try {
    console.log('updateStatus')
    const subgraphUrls = SACRA_SUBGRAPH_URL.split(',');
    let data           = [];
    for (let i = 0; i < subgraphUrls.length; i++) {
      const tempData = await fetchData(query, entityType, lastIdField, subgraphUrls[i]);
      data           = data.concat(tempData);
    }
    const totalCount = data.length.toString();
    const botUser    = await guild.members.fetch(bot.user.id);
    botUser.setNickname(nickname);

    const status = { type: 4, name: `${totalCount} ${description.toLowerCase()}` };
    await bot.statusUpdater.addStatus(status);
    await bot.statusUpdater.updateStatus(status);
  } catch (error) {
    console.error('Error in updateStatus:', error);
  } finally {
    setTimeout(() => updateStatus(bot, guild, nickname, description, query, entityType, lastIdField), DELAY_MS);
  }
}

// RUN BOTS
runBot(process.env.SACRA_LIVING_HERO_BOT, 'Living heroes', LIVING_HERO_QUERY, 'heroEntities');
runBot(process.env.SACRA_DEAD_HERO_BOT, 'Dead heroes', DEAD_HERO_QUERY, 'heroEntities');
runBot(process.env.SACRA_ITEMS_BOT, 'Items', ITEM_QUERY, 'itemEntities');
runBot(process.env.SACRA_BROKEN_ITEMS_BOT, 'Destroyed items', DESTROYED_ITEM_QUERY, 'itemEntities');
runBot(process.env.SACRA_USER_BOT, 'Unique users', USER_QUERY, 'userEntities');
runBotWithDescription(process.env.SACRA_HERO_FINISH_FIRST_BIOME_BOT, 'Biome #1', 'Bosses killed', HERO_FINISH_FIRST_BIOME_QUERY, 'heroEntities');
runBotWithDescription(process.env.SACRA_HERO_FINISH_SECOND_BIOME_BOT, 'Biome #2', 'Bosses killed', HERO_FINISH_SECOND_BIOME_QUERY, 'heroEntities');
runBotWithDescription(process.env.SACRA_HERO_FINISH_THIRD_BIOME_BOT, 'Biome #3', 'Bosses killed', HERO_FINISH_THIRD_BIOME_QUERY, 'heroEntities');
runBot(process.env.SACRA_HERO_REINFORCEMENT_BOT, 'Stacked heroes', HERO_REINFORCEMENT_QUERY, 'heroEntities');
