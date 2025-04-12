const createResponse = ({ error = null, data = null, status = 200 } = {}) => {
  return new Response(
    JSON.stringify({
      success: error === null,
      message: error,
      data: data,
    }),
    { status: status }
  );
};

export default createResponse;
