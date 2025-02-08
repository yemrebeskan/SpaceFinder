exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello I will read from! ${process.env.TABLE_NAME}`,
    }),
  };
};
