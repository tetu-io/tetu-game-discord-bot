const { fetchData } = require('../api/fetchData');
const { HERO_META_QUERY } = require('../api/queries');

async function getHeroPaymentToken(url) {
  const controllerEntities = await fetchData(HERO_META_QUERY, url);
  if (controllerEntities.heroMetaEntities.length > 0) {
    return controllerEntities.heroMetaEntities[0].feeToken.token.id;
  }

  return undefined;
}

module.exports = { getHeroPaymentToken };