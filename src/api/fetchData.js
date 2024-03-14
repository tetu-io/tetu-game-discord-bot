const axios = require('axios');

async function fetchData(query, url) {
  console.log('Start fetching data for', url);
  try {
    const response = await axios.post(url, { query });
    console.log('Data fetched!');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function fetchDataWithPagination(query, entityType, url) {
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

module.exports = { fetchData, fetchDataWithPagination };
