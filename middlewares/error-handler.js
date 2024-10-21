module.exports = (err, req, res, next) => {
  console.error(err);
  const { status = 500, message = "Internal Server Error" } = err;
  res.status(status).send({ message });
};
