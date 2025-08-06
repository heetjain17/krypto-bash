import axios from 'axios';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

const API_KEY = import.meta.env.VITE_COIN_GECKO_API_KEY;

if (!API_KEY) {
  console.warn(
    'Warning: CoinGecko API key is not set. You may experience rate limiting.'
  );
}

const apiClient = axios.create({
  baseURL: COINGECKO_API_URL,
});

export const getAllCoinsData = async (page = 1, perPage = 100) => {
  try {
    const res = await apiClient.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        per_page: perPage,
        page: page,
        order: 'market_cap_desc',
        x_cg_demo_api_key: API_KEY,
      },
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching coin markets:', error);
    throw error;
  }
};

export const getCoinData = async (coinId) => {
  try {
    const res = await apiClient.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
        x_cg_demo_api_key: API_KEY,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    throw error;
  }
};

export const getCoinChart = async (coinId, days = 365) => {
  if (!coinId) throw new Error('Coin ID is required.');

  try {
    const res = await apiClient.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        x_cg_demo_api_key: API_KEY,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching market chart for coin ${coinId}:`, error);
    throw error;
  }
};

export const searchCoins = async (query) => {
  if (!query) return;
  try {
    const res = await apiClient.get('/search', {
      params: {
        query: query,
        x_cg_demo_api_key: API_KEY,
      },
    });
    return res.data.coins.slice(0, 10) || [];
  } catch (error) {
    console.error(`Error searching for coins with query "${query}":`, error);
    throw error;
  }
};

export const getMarketsForIds = async (ids = []) => {
  if (ids.length === 0) return [];
  try {
    const res = await apiClient.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: ids.join(','),
        order: 'market_cap_desc',
        x_cg_demo_api_key: API_KEY,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching markets for coin IDs:`, error);
    throw error;
  }
};
