const router = require("express").Router();
const { Post, User, Comment, Menu } = require("../../models");

router.get("/menu", async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    const menuData = await Menu.findAll();
    const menu = menuData.map((item) => item.get({ plain: true }));

    res.render("menu/menu", { menu, isLogged });
    return;
  } catch (error) {
    res.render("error", error);
  }
});

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
