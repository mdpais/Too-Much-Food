const router = require("express").Router();
const { User } = require("../../models");

router.post("/signup", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user = userData;
      req.session.isLogged = true;

      res.status(200).json(userData);
    });
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res.status(400).json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user = userData;
      req.session.isLogged = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.isLogged) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
