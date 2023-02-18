const router = require("express").Router();

router.get("/signup",(req, res) => {
  if (req.session.isLogged) {
    res.redirect("/");
    return;
  }

  res.render("auth/signup");
});

router.get("/signin", (req, res) => {
  if (req.session.isLogged) {
    res.redirect("/");
    return;
  }

  res.render("auth/signin");
});

router.get("/signout", (req, res) => {
    if (req.session.isLogged) {
      res.redirect("/");
      return;
    }
  
    res.render("auth/signin");
  });

module.exports = router;
