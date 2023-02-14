const router = require('express').Router();
const { OrderedItems, Menu, User, Order } = require('../../models');

// GET all ordered items
router.get('/', async (req, res) => {
  try {
    const orderedItemsData = await OrderedItems.findAll({
    include: [{ model: Menu }, { model: Order }, { model: User, through: Order, as: 'employee' }]
  });
    res.status(200).json(orderedItemsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;