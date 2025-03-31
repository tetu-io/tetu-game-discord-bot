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
const { getHeroPaymentToken } = require('../utils/getHeroPaymentToken');
const { formatUnits } = require('ethers');
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

    let name = `${totalCount} ${description ? description : nickname}`;
    if (name.length > 25) {
      name = `${totalCount}`;
    }
    const status = { type: 4, name: name };
    await bot.statusUpdater.addStatus(status);
    await bot.statusUpdater.updateStatus(status);
  } catch (error) {
    console.error('Error in updateStatus:', error);
  } finally {
    setTimeout(() => updateStatus(bot, guild, nickname, query, entityType, description), DELAY_MS);
  }
}

async function updateStatusTotalSupply(bot, guild, nickname, query) {
  try {
    const controller = await getControllerEntityFromGraph(SACRA_SUBGRAPH_URL);
    //if (controller) {
    //  query = query.replace('$id', controller.gameToken.toLowerCase());
    //}
    //const tokenEntity = await fetchData(query, SACRA_SUBGRAPH_URL);
    //let totalSupplyFormatted = 0;
    //let symbol = '';
    //if (tokenEntity['tokenEntities'].length === 0) {
    //  console.log('No token entity found');
    //} {
    //  const totalSupply = tokenEntity['tokenEntities'][0]['totalSupply'];
    //  const decimals = tokenEntity['tokenEntities'][0]['decimals'];
    //  symbol = tokenEntity['tokenEntities'][0]['symbol'];
    //  totalSupplyFormatted = numeral((totalSupply / (10 ** decimals)).toFixed(0)).format('0.0a');
    //}
    const gameContract = new ethers.Contract(controller.gameToken, getContractABI('GameToken'), getProvider());
    const totalSupply = await gameContract.totalSupply();
    const botUser    = await guild.members.fetch(bot.user.id);
    const totalSupplyFormatted = numeral(formatUnits(totalSupply, 18)).format('0.0a');
    const symbol = await gameContract.symbol();

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
          description = `#${biome} - ${ (treasuryAmount / (10n ** BigInt(decimal)))} ${symbol}`;
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
    setTimeout(() => updateStatsForRewards(bot, guild, nickname, query, biome), DELAY_MS);
  }
}

async function updateTreasuryBalance(bot, guild, nickname, query) {
  try {
    const controller = await getControllerEntityFromGraph(SACRA_SUBGRAPH_URL);
    if (controller) {
      const gameToken = controller.gameToken;
      const paymentToken = await getHeroPaymentToken(SACRA_SUBGRAPH_URL);
      const treasury = controller.treasury.id;

      const gameContract = new ethers.Contract(gameToken, getContractABI('GameToken'), getProvider());
      const paymentTokenContract = new ethers.Contract(paymentToken, getContractABI('GameToken'), getProvider());

      const gameTreasuryBalance = await gameContract.balanceOf(treasury);
      const gameDecimal = await gameContract.decimals();
      const gameSymbol = await gameContract.symbol();

      const paymentTokenTreasuryBalance = await paymentTokenContract.balanceOf(treasury);
      const paymentTokenDecimal = await paymentTokenContract.decimals();
      const paymentTokenSymbol = await paymentTokenContract.symbol();

      const gameTreasuryBalanceFormatted = numeral((gameTreasuryBalance / (10n ** gameDecimal))).format('0.0a');
      const paymentTokenTreasuryBalanceFormatted = numeral((paymentTokenTreasuryBalance / (10n ** paymentTokenDecimal))).format('0.0a');
      const botUser    = await guild.members.fetch(bot.user.id);

      botUser.setNickname(nickname);

      const status = { type: 4, name: `${gameTreasuryBalanceFormatted} ${gameSymbol} | ${paymentTokenTreasuryBalanceFormatted} ${paymentTokenSymbol}` };
      await bot.statusUpdater.addStatus(status);
      await bot.statusUpdater.updateStatus(status);
    } else {
      console.log('No controller entity found');
    }
  } catch (e) {
    console.error('Error in updateStatus:', e);
  } finally {
    setTimeout(() => updateTreasuryBalance(bot, guild, nickname, query), DELAY_MS);
  }
}

async function updateRewardPoolBalance(bot, guild, nickname, query) {
  try {
    const controller = await getControllerEntityFromGraph(SACRA_SUBGRAPH_URL);
    if (controller) {
      const rewardPool = controller.rewardPool;

      const token = await getHeroPaymentToken(SACRA_SUBGRAPH_URL);

      const contract = new ethers.Contract(token, getContractABI('ERC20'), getProvider());

      const rewardPoolBalance = await contract.balanceOf(rewardPool);
      const decimal = await contract.decimals();
      const symbol = await contract.symbol();

      const rewardPoolBalanceFormatted = numeral((rewardPoolBalance / (10n ** decimal))).format('0.0a');
      const botUser    = await guild.members.fetch(bot.user.id);

      botUser.setNickname(nickname);

      const status = { type: 4, name: `${rewardPoolBalanceFormatted} ${symbol}` };
      await bot.statusUpdater.addStatus(status);
      await bot.statusUpdater.updateStatus(status);
    } else {
      console.log('No controller entity found');
    }
  } catch (e) {
    console.error('Error in updateStatus:', e);
  } finally {
    setTimeout(() => updateRewardPoolBalance(bot, guild, nickname, query), DELAY_MS);
  }
}

async function updateMaxNgLevel(bot, guild, nickname, query) {
  try {
    const controller = await getControllerEntityFromGraph(SACRA_SUBGRAPH_URL);
    if (controller) {
      const heroController = controller.heroController;

      const contract = new ethers.Contract(heroController, getContractABI('HeroController'), getProvider());

      const maxNgLevel = await contract.maxOpenedNgLevel();

      const botUser    = await guild.members.fetch(bot.user.id);

      botUser.setNickname(nickname);

      const status = { type: 4, name: `${maxNgLevel} Level` };
      await bot.statusUpdater.addStatus(status);
      await bot.statusUpdater.updateStatus(status);
    } else {
      console.log('No controller entity found');
    }
  } catch (e) {
    console.error('Error in updateStatus:', e);
  } finally {
    setTimeout(() => updateMaxNgLevel(bot, guild, nickname, query), DELAY_MS);
  }
}

module.exports = {
  updateStatus,
  updateStatusTotalSupply,
  updateStatsForRewards,
  updateTreasuryBalance,
  updateRewardPoolBalance,
  updateMaxNgLevel
};
