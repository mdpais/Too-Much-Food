const router = require("express").Router();
const { Order, User, Menu, OrderedItems } = require("../../models");
const withAuth = require("../../utils/isLogged");

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

    res.render("order/orders", {
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

module.exports = router;
