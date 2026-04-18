exports.handler = async (event) => {

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
      }
    };
  }

  try {
    const { message } = JSON.parse(event.body); // 🔥 INI YANG KURANG

    const url = process.env.GSHEET_URL;

    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ message })
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ ok: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
