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

const HERO_META_QUERY = `
  query {
  heroMetaEntities(
    first: 1
  ) {
    feeToken {
      token {
        id
      }
    }
  }
  }
`;

const TOKEN_QUERY = `
  query {
    tokenEntities(
    where:{
      id: "$id"
    }
    first: 1
  ) {
    totalSupply
    decimals
    symbol
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

const HERO_FINISH_FOURTH_BIOME_QUERY = `
  query {
    heroEntities(
      where: { maxBiomeCompleted_gt: 3 }
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

const CONTROLLER_QUERY = `
  query {
    controllerEntities(
      first: 1
    ) {
      dungeonFactory
      gameToken
      rewardPool
      heroController
      treasury {
        id
      }
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
    where: {
      burned: true
      consumableInfo: null
    }
  ) {
    id
  }
  }
`;

module.exports = {
  USER_QUERY,
  TOKEN_QUERY,
  HERO_FINISH_FIRST_BIOME_QUERY,
  HERO_FINISH_SECOND_BIOME_QUERY,
  HERO_FINISH_THIRD_BIOME_QUERY,
  HERO_FINISH_FOURTH_BIOME_QUERY,
  HERO_REINFORCEMENT_QUERY,
  LIVING_HERO_QUERY,
  DEAD_HERO_QUERY,
  ITEM_QUERY,
  CONTROLLER_QUERY,
  DESTROYED_ITEM_QUERY,
  HERO_META_QUERY
};