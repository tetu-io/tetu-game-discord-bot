const dotenv = require('dotenv');
const { LIVING_HERO_QUERY, DEAD_HERO_QUERY, ITEM_QUERY, DESTROYED_ITEM_QUERY, USER_QUERY, TOKEN_QUERY, HERO_FINISH_FIRST_BIOME_QUERY, HERO_FINISH_SECOND_BIOME_QUERY, HERO_FINISH_THIRD_BIOME_QUERY, HERO_FINISH_FOURTH_BIOME_QUERY, HERO_REINFORCEMENT_QUERY } = require('./api/queries');
const { runBot } = require('./bots/runBot');

dotenv.config();

// RUN BOTS
runBot(process.env.SACRA_USER_BOT, 'Unique users', USER_QUERY, 'userEntities', 'Users');
runBot(process.env.SACRA_TOTAL_SUPPLY_BOT, 'Total supply', TOKEN_QUERY, 'totalSupply');
runBot(process.env.SACRA_TREASURY_BALANCE_BOT, 'Treasury balance', TOKEN_QUERY, 'treasuryBalance');
runBot(process.env.SACRA_HERO_FINISH_FIRST_BIOME_BOT, 'Reward Pool', TOKEN_QUERY, 'rewardPoolBalance');
runBot(process.env.SACRA_HERO_FINISH_SECOND_BIOME_BOT, 'Max NG Level', TOKEN_QUERY, 'maxNgLevel');
runBot(process.env.SACRA_REWARDS_FOURTH_BIOME_BOT, 'Myrd staking', TOKEN_QUERY, 'myrdStaking');

// DEPRECATED BOTS
//runBot(process.env.SACRA_LIVING_HERO_BOT, 'Heroes: Living', LIVING_HERO_QUERY, 'heroEntities', 'Heroes');
//runBot(process.env.SACRA_DEAD_HERO_BOT, 'Heroes: Dead', DEAD_HERO_QUERY, 'heroEntities', 'Heroes');
//runBot(process.env.SACRA_HERO_REINFORCEMENT_BOT, 'Heroes: Stacked', HERO_REINFORCEMENT_QUERY, 'heroEntities', 'Heroes');
//runBot(process.env.SACRA_ITEMS_BOT, 'Items: Available', ITEM_QUERY, 'itemEntities', 'Items');
//runBot(process.env.SACRA_BROKEN_ITEMS_BOT, 'Items: Destroyed', DESTROYED_ITEM_QUERY, 'itemEntities', 'Items');
//runBot(process.env.SACRA_HERO_FINISH_FIRST_BIOME_BOT, 'Biome #1', HERO_FINISH_FIRST_BIOME_QUERY, 'heroEntities', 'Bosses killed');
//runBot(process.env.SACRA_HERO_FINISH_SECOND_BIOME_BOT, 'Biome #2', HERO_FINISH_SECOND_BIOME_QUERY, 'heroEntities', 'Bosses killed');
//runBot(process.env.SACRA_HERO_FINISH_THIRD_BIOME_BOT, 'Biome #3', HERO_FINISH_THIRD_BIOME_QUERY, 'heroEntities', 'Bosses killed');
//runBot(process.env.SACRA_HERO_FINISH_FOURTH_BIOME_BOT, 'Biome #4', HERO_FINISH_FOURTH_BIOME_QUERY, 'heroEntities', 'Bosses killed');
//runBot(process.env.SACRA_REWARDS_FIRST_BIOME_BOT, 'Rewards per dung Biome #1', TOKEN_QUERY, 'rewardsPerBiome', '', [1]);
//runBot(process.env.SACRA_REWARDS_SECOND_BIOME_BOT, 'Rewards per dung Biome #2', TOKEN_QUERY, 'rewardsPerBiome', '', [2]);
//runBot(process.env.SACRA_REWARDS_THIRD_BIOME_BOT, 'Rewards per dung Biome #3', TOKEN_QUERY, 'rewardsPerBiome', '', [3]);
//runBot(process.env.SACRA_REWARDS_FOURTH_BIOME_BOT, 'Rewards per dung Biome #4', TOKEN_QUERY, 'rewardsPerBiome', '', [4]);
