const { Client } = require('discord.js');
const StatusUpdater = require('@tmware/status-rotate');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// 10 min
const DELAY_MS = 600000;
const GUILD_ID = process.env.GUILD_ID;
const SACRA_SUBGRAPH_URL = process.env.SACRA_SUBGRAPH_URL;

const USER_QUERY = `
  query {
    userEntities(
      where: { id_gt: $lastId }
      first: 1000
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
      where: { id_gt: $lastId, maxBiomeCompleted_gt: 0 }
      first: 1000
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
      where: { id_gt: $lastId, maxBiomeCompleted_gt: 1 }
      first: 1000
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
      where: { id_gt: $lastId, staked: true }
      first: 1000
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
      where: { id_gt: $lastId, owner_not:"0x0000000000000000000000000000000000000000" }
      first: 1000
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
      where: { id_gt: $lastId, owner:"0x0000000000000000000000000000000000000000" }
      first: 1000
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
      where: { id_gt: $lastId, user_not:"0x0000000000000000000000000000000000000000" }
      first: 1000
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
      where: { id_gt: $lastId, user:"0x0000000000000000000000000000000000000000" }
      first: 1000
      orderBy: id
      orderDirection: asc 
    ) {
      id
    }
  }
`;

async function fetchData(query, entityType, lastIdField, url) {
  let allData = [];
  let lastId = "0x0000000000000000000000000000000000000000";

  while (true) {
    const paginatedQuery = query.replace('$lastId', lastId ? `"${lastId}"` : "null");
    try {
      const response = await axios.post(url, {
        query: paginatedQuery
      });
      const data = response.data;
      const entities = data.data[entityType];

      if (entities.length === 0) {
        console.log(`Finish ${entityType} ${allData.length}`)
        break;
      }

      allData = allData.concat(entities);
      lastId = entities[entities.length - 1][lastIdField];
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  return allData;
}

async function runBotWithDescription(token, nickname, description, query, entityType) {
  console.log('runBot')
  const bot = new Client({ intents: [] });
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
    let data = [];
    for (let i = 0; i < subgraphUrls.length; i++) {
      const tempData = await fetchData(query, entityType, lastIdField, subgraphUrls[i]);
      data = data.concat(tempData);
    }
    const totalCount = data.length.toString();
    const botUser = await guild.members.fetch(bot.user.id);
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
runBotWithDescription(process.env.SACRA_HERO_FINISH_FIRST_BIOME_BOT, 'Bosses #1', 'Bosses killed in the 1 biome', HERO_FINISH_FIRST_BIOME_QUERY, 'heroEntities');
runBotWithDescription(process.env.SACRA_HERO_FINISH_SECOND_BIOME_BOT, 'Bosses #2', 'Bosses killed in the 2 biome', HERO_FINISH_SECOND_BIOME_QUERY, 'heroEntities');
runBot(process.env.SACRA_HERO_REINFORCEMENT_BOT, 'Stacked heroes', HERO_REINFORCEMENT_QUERY, 'heroEntities');