const numeral = require('numeral');
const { Client } = require('discord.js');
const StatusUpdater                  = require('@tmware/status-rotate');
const { DELAY_MS, DEFAULT_HERO_LVL } = require('../config/constants');

const dotenv = require('dotenv');
const { fetchData, fetchDataWithPagination } = require('../api/fetchData');
const { getControllerEntityFromGraph } = require('../utils/getControllerInfo');
const ethers = require('ethers');
const { getContractABI } = require('../utils/getContractABI');
const { getProvider } = require('../api/ethProvider');
dotenv.config();

const SACRA_SUBGRAPH_URL = process.env.SACRA_SUBGRAPH_URL;


async function updateStatus(bot, guild, nickname, query, entityType, description) {
  try {
    console.log('updateStatus')
    const subgraphUrls = SACRA_SUBGRAPH_URL.split(',');
    let data           = [];
    for (let i = 0; i < subgraphUrls.length; i++) {
      const tempData = await fetchDataWithPagination(query, entityType, subgraphUrls[i]);
      data           = data.concat(tempData);
    }
    const totalCount = data.length.toString();
    const botUser    = await guild.members.fetch(bot.user.id);
    botUser.setNickname(nickname);

    const status = { type: 4, name: `${totalCount} ${description ? description.toLowerCase() : nickname}` };
    await bot.statusUpdater.addStatus(status);
    await bot.statusUpdater.updateStatus(status);
  } catch (error) {
    console.error('Error in updateStatus:', error);
  } finally {
    setTimeout(() => updateStatus(bot, guild, nickname, description, query, entityType, lastIdField), DELAY_MS);
  }
}

async function updateStatusTotalSupply(bot, guild, nickname, query) {
  try {
    const controller = await getControllerEntityFromGraph(SACRA_SUBGRAPH_URL);
    if (controller) {
      query = query.replace('$id', controller.gameToken.toLowerCase());
    }
    const tokenEntity = await fetchData(query, SACRA_SUBGRAPH_URL);
    let totalSupplyFormatted = 0;
    let symbol = '';
    if (tokenEntity['tokenEntities'].length === 0) {
      console.log('No token entity found');
    } {
      const totalSupply = tokenEntity['tokenEntities'][0]['totalSupply'];
      const decimals = tokenEntity['tokenEntities'][0]['decimals'];
      symbol = tokenEntity['tokenEntities'][0]['symbol'];
      totalSupplyFormatted = numeral((totalSupply / (10 ** decimals)).toFixed(0)).format('0.0a');
    }
    const botUser    = await guild.members.fetch(bot.user.id);

    botUser.setNickname(nickname);

    const status = { type: 4, name: `${totalSupplyFormatted} ${symbol}` };
    await bot.statusUpdater.addStatus(status);
    await bot.statusUpdater.updateStatus(status);
  } catch (e) {
    console.error('Error in updateStatus:', e);
  } finally {
    setTimeout(() => updateStatusTotalSupply(bot, guild, nickname, query), DELAY_MS);
  }
}

async function updateStatsForRewards(bot, guild, nickname, query, biome) {
  try {
    const controller = await getControllerEntityFromGraph(SACRA_SUBGRAPH_URL);
    if (controller) {
      const dungeonFactory = controller.dungeonFactory;

      query = query.replace('$id', controller.gameToken.toLowerCase());

      const contract = new ethers.Contract(dungeonFactory, getContractABI('DungeonFactory'), getProvider());

      const tokenEntity = await fetchData(query, SACRA_SUBGRAPH_URL);
      let heroLvl = biome * DEFAULT_HERO_LVL - 4;

      if (tokenEntity['tokenEntities'].length > 0) {
        const result = await contract.getDungeonTreasuryAmount(
          controller.gameToken,
          heroLvl,
          biome
        );
        console.log('biome', biome)
        console.log('amountForDungeon', result[1]);
        console.log('mintAmount', result[2]);
        console.log('-------------------')
        const decimal = tokenEntity['tokenEntities'][0]['decimals'];
        const symbol = tokenEntity['tokenEntities'][0]['symbol'];
        const treasuryAmount = result[1] + result[2];
        let description = 'No rewards yet';
        if (treasuryAmount > 0) {
          description = `${ (treasuryAmount / (10n ** BigInt(decimal)))} ${symbol}`;
        }

        const botUser    = await guild.members.fetch(bot.user.id);

        botUser.setNickname(description);

        const status = { type: 4, name: nickname };
        await bot.statusUpdater.addStatus(status);
        await bot.statusUpdater.updateStatus(status);
      } else {
        console.log('No token entity found')
      }
    } else {
      console.log('No controller entity found');
    }
  } catch (e) {
    console.error('Error in updateStatus:', e);
  } finally {
    setTimeout(() => updateStatsForRewards(bot, guild, nickname, heroLevel, biome), DELAY_MS);
  }
}

module.exports = {
  updateStatus,
  updateStatusTotalSupply,
  updateStatsForRewards
};
