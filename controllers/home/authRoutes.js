const isLogged = require("../../utils/isLogged");

const router = require("express").Router();

///////////////////////////////////////////////////////////////////////////////
// Renders signup page (if not auth)
///////////////////////////////////////////////////////////////////////////////
router.get("/signup", (req, res) => {
  if (req.session.isLogged) {
    res.redirect("/");
    return;
  }

  res.render("auth/signup");
});

///////////////////////////////////////////////////////////////////////////////
// Renders signin page (if not auth)
///////////////////////////////////////////////////////////////////////////////
router.get("/signin", (req, res) => {
  if (req.session.isLogged) {
    res.redirect("/");
    return;
  }

  res.render("auth/signin");
});

///////////////////////////////////////////////////////////////////////////////
// Renders profile page (if not auth)
///////////////////////////////////////////////////////////////////////////////
/* router.get("/signout", (req, res) => {
  if (req.session.isLogged) {
    res.redirect("/");
    return;
  }

  res.render("auth/signin");
}); */

///////////////////////////////////////////////////////////////////////////////
// Renders profile page
///////////////////////////////////////////////////////////////////////////////
router.get("/profile", isLogged, async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user.id, {
      attributes: { exclude: ["password"] },
      // include: [{ model: Order }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      isLogged: true,
    });
  } catch (error) {
    res.render("error", {
      isLogged,
      error,
    });
  }
});

module.exports = router;
