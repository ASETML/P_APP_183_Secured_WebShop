module.exports = {
  get: (req, res) => {
    res.json(req.body.username);
  },
};
