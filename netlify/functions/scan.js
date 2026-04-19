const CHAINS = {
  eth: {
    api: 'https://api.etherscan.io/api',
    key: process.env.ETHERSCAN_KEY || '',
  },
  bsc: {
    api: 'https://api.bscscan.com/api',
    key: process.env.BSCSCAN_KEY || '',
  },
  base: {
    api: 'https://api.basescan.org/api',
    key: process.env.BASESCAN_KEY || '',
  },
  arb: {
    api: 'https://api.arbiscan.io/api',
    key: process.env.ARBISCAN_KEY || '',
  },
};

async function getTxCount(chain, address) {
  const url = `${chain.api}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${chain.key}`;
  const res  = await fetch(url);
  const json = await res.json();
  if (json.status === '1') return json.result.length;
  if (json.message === 'No transactions found') return 0;
  throw new Error(json.message || 'API error');
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const address = event.queryStringParameters?.address || '';

  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid wallet address' }),
    };
  }

  const results = {};
  await Promise.all(
    Object.entries(CHAINS).map(async ([id, chain]) => {
      try {
        results[id] = await getTxCount(chain, address);
      } catch (e) {
        results[id] = null; // null = error
      }
    })
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, results }),
  };
};
