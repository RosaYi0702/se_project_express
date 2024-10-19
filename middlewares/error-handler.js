module.exports = (err, req, res, next) => {
  console.error(err);
  const { status = 500, message = "Internal Serber Error" } = err;
  res.status(status).send({ message });
};
