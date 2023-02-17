const router = require("express").Router();
const authRoutes = require("./authRoutes");
//const orderRoutes = require('./orderRoutes');
//const menuRoutes = require('./menuRoutes');
//const reportRoutes = require('./reportRoutes');

router.use("/", authRoutes);
//router.use('/orders', orderRoutes);
//router.use('/menu', menuRoutes);
//router.use('/reports', reportRoutes);

///////////////////////////////////////////////////////////////////////////////
// Render home page
///////////////////////////////////////////////////////////////////////////////
router.get("/", async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    res.render("homepage", {
      isLogged,
    });
  } catch (error) {
    res.render("error", {
      isLogged,
      error,
    });
  }
});

module.exports = router;
