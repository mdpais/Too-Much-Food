const router = require("express").Router();
const { Post, User, Comment, Menu } = require("../../models");

///////////////////////////////////////////////////////////////////////////////
// Gets all menu and renders menu page
///////////////////////////////////////////////////////////////////////////////
router.get("/menu", async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    const menuData = await Menu.findAll();

    const menu = menuData.map((plate) => plate.get({ plain: true }));

    res.render("menu/menu", {
      menu,
      isLogged,
    });
  } catch (error) {
    res.render("error", {
      isLogged,
      error,
    });
  }
});

///////////////////////////////////////////////////////////////////////////////
// Gets plate by id and renders plate page
///////////////////////////////////////////////////////////////////////////////
router.get("/menu/:id", async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    const plateData = await Menu.findByPk(req.params.id);
    const plate = plateData.get({ plain: true });

    res.render("menu/plate", { plate, isLogged });
  } catch (error) {
    res.render("error", error);
  }
});

module.exports = router;
