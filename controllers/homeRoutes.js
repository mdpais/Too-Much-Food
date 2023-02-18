const router = require("express").Router();
const { Order, User, Menu, OrderedItems } = require("../models");
const withAuth = require("../utils/isLogged");

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

///////////////////////////////////////////////////////////////////////////////
// Render profile page
///////////////////////////////////////////////////////////////////////////////
router.get("/profile", withAuth, async (req, res) => {
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
///////////////////////////////////////////////////////////////////////////////
// Render login page
///////////////////////////////////////////////////////////////////////////////
router.get("/login", (req, res) => {
  if (req.session.isLogged) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

module.exports = router;

///////////////////////////////////////////////////////////////////////////////
// Gets all orders and renders orders page
///////////////////////////////////////////////////////////////////////////////
router.get("/orders", withAuth, async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    const ordersData = await Order.findAll({
      include: [{ model: User }, { model: Menu, through: OrderedItems }],
    });

    const orders = ordersData.map((order) => order.get({ plain: true }));

    console.log(orders);

    res.render("orders", {
      orders,
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
// Gets all menu and renders menu page
///////////////////////////////////////////////////////////////////////////////
router.get("/menu", async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    const menuData = await Menu.findAll();

    const menu = menuData.map((plate) => plate.get({ plain: true }));

    res.render("menu", {
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
// Gets all ordered items and renders reports page
///////////////////////////////////////////////////////////////////////////////
router.get("/report", async (req, res) => {
  const isLogged = req.session.isLogged;

  try {
    const orderedItemsData = await OrderedItems.findAll({
      include: [{ model: Order, include: [{ model: User }] }, { model: Menu }],
    });

    const orderedItems = orderedItemsData.map((orderedItem) => orderedItem.get({ plain: true }));

    res.render("report", {
      orderedItems,
      isLogged,
    });
  } catch (error) {
    res.render("error", {
      isLogged,
      error,
    });
  }
});
