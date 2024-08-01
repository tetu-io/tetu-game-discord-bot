const { Client }                                                       = require('discord.js');
const { updateStatus, updateStatusTotalSupply, updateStatsForRewards, updateTreasuryBalance } = require('./updateStatus');
const dotenv                                                           = require('dotenv');
const StatusUpdater = require('@tmware/status-rotate');
dotenv.config();

const GUILD_ID           = process.env.GUILD_ID;

async function runBot(token, nickname, query, entityType, description = '', extraParams = []) {
  const bot = new Client({ intents: [] });
  bot.statusUpdater = new StatusUpdater(bot);
  bot.login(token);

  const guild = await bot.guilds.fetch(GUILD_ID);

  bot.once('ready', () => {
    console.log(`${nickname} bot ready`);

    if (entityType === 'totalSupply') {
      updateStatusTotalSupply(bot, guild, nickname, query);
    } else if (entityType === 'rewardsPerBiome') {
      updateStatsForRewards(bot, guild, nickname, query, extraParams[0]);
    } else if (entityType === 'treasuryBalance') {
      updateTreasuryBalance(bot, guild, nickname, query);
    } else {
      updateStatus(bot, guild, nickname, query, entityType, description);
    }
  });
}

module.exports = { runBot };