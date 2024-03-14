const dotenv = require('dotenv');
const { LIVING_HERO_QUERY, DEAD_HERO_QUERY, ITEM_QUERY, DESTROYED_ITEM_QUERY, USER_QUERY, TOKEN_QUERY, HERO_FINISH_FIRST_BIOME_QUERY, HERO_FINISH_SECOND_BIOME_QUERY, HERO_FINISH_THIRD_BIOME_QUERY, HERO_FINISH_FOURTH_BIOME_QUERY, HERO_REINFORCEMENT_QUERY } = require('./api/queries');
const { runBot } = require('./bots/runBot');

dotenv.config();

// RUN BOTS
runBot(process.env.SACRA_LIVING_HERO_BOT, 'Living heroes', LIVING_HERO_QUERY, 'heroEntities');
runBot(process.env.SACRA_DEAD_HERO_BOT, 'Dead heroes', DEAD_HERO_QUERY, 'heroEntities');
runBot(process.env.SACRA_ITEMS_BOT, 'Items', ITEM_QUERY, 'itemEntities');
runBot(process.env.SACRA_BROKEN_ITEMS_BOT, 'Destroyed items', DESTROYED_ITEM_QUERY, 'itemEntities');
runBot(process.env.SACRA_USER_BOT, 'Unique users', USER_QUERY, 'userEntities');
runBot(process.env.SACRA_HERO_FINISH_FIRST_BIOME_BOT, 'Biome #1', HERO_FINISH_FIRST_BIOME_QUERY, 'heroEntities', 'Bosses killed');
runBot(process.env.SACRA_HERO_FINISH_SECOND_BIOME_BOT, 'Biome #2', HERO_FINISH_SECOND_BIOME_QUERY, 'heroEntities', 'Bosses killed');
runBot(process.env.SACRA_HERO_FINISH_THIRD_BIOME_BOT, 'Biome #3', HERO_FINISH_THIRD_BIOME_QUERY, 'heroEntities', 'Bosses killed');
runBot(process.env.SACRA_HERO_FINISH_FOURTH_BIOME_BOT, 'Biome #4', HERO_FINISH_FOURTH_BIOME_QUERY, 'heroEntities', 'Bosses killed');
runBot(process.env.SACRA_HERO_REINFORCEMENT_BOT, 'Stacked heroes', HERO_REINFORCEMENT_QUERY, 'heroEntities');
runBot(process.env.SACRA_TOTAL_SUPPLY_BOT, 'Total supply', TOKEN_QUERY, 'totalSupply');
runBot(process.env.SACRA_REWARDS_FIRST_BIOME_BOT, 'Rewards per dung Biome #1', TOKEN_QUERY, 'rewardsPerBiome', '', [1]);
runBot(process.env.SACRA_REWARDS_SECOND_BIOME_BOT, 'Rewards per dung Biome #2', TOKEN_QUERY, 'rewardsPerBiome', '', [2]);
runBot(process.env.SACRA_REWARDS_THIRD_BIOME_BOT, 'Rewards per dung Biome #3', TOKEN_QUERY, 'rewardsPerBiome', '', [3]);
runBot(process.env.SACRA_REWARDS_FOURTH_BIOME_BOT, 'Rewards per dung Biome #4', TOKEN_QUERY, 'rewardsPerBiome', '', [4]);


