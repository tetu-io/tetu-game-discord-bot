const { fetchData } = require('../api/fetchData');
const { CONTROLLER_QUERY } = require('../api/queries');

async function getControllerEntityFromGraph(url) {
  const controllerEntities = await fetchData(CONTROLLER_QUERY, url);
  if (controllerEntities.controllerEntities.length > 0) {
    return controllerEntities.controllerEntities[0];
  }

  return undefined;
}

module.exports = { getControllerEntityFromGraph };