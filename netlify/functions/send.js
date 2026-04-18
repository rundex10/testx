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
    const { message } = JSON.parse(event.body);

    await fetch("https://script.google.com/macros/s/AKfycby4TSBJ58EN6xMU23xkU3UwpD9ux0QczAUEZbvylubkuJFnmq9TDesPnX97FQUoLlPWog/exec", {
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
