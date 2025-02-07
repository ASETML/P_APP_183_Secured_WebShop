module.exports = {
  get: (req, res) => {
    const token = req.body.token;
    if (token) {
      try {
        console.log(token);
        const decodedToken = jsonwebtoken.verify(token, process.env.SECRETKEY);
        console.log(decodedToken);
        return res.status(200).json({ user: decodedToken.username });
      } catch (error) {
        return res.status(401).json({ error: error });
      }
    } else {
      return res.status(400).json({ error: "Vous devez fournir un token" });
    }
  },
};
