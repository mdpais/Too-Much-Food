const router = require("express").Router();
const { Menu, User } = require("../../models");
const auth = require("../../utils/isLogged");

// GET all menu items (JSON)
router.get("/menuJson", async (req, res) => {
  try {
    const menuData = await Menu.findAll({
      where: {
        active: 1,
      },
    });
    res.status(200).json(menuData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// GET all menu items
router.get("/", auth, async (req, res) => {
  const isLogged = req.session.isLogged;
  try {
    const menuData = await Menu.findAll({
      order: [["item", "ASC"]],
    });
    const menuItems = menuData.map((menu) => menu.get({ plain: true }));
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    const user = userData.get({ plain: true });
    res.render("menu", {
      menuItems,
      ...user,
      isLogged,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a menu item
router.post("/", async (req, res) => {
  try {
    const menuData = await Menu.create(req.body);
    res.status(200).json(menuData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE a menu item
router.put("/:id", async (req, res) => {
  try {
    const menuData = await Menu.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!menuData) {
      res.status(404).json({ message: "No menu item found with this id!" });
      return;
    }

    res.status(200).json({ message: "Updated!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
