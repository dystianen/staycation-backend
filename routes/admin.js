const router = require("express").Router();
const adminController = require("../controllers/AdminController");
const { upload } = require("../middlewares/multer");

router.get("/dashboard", adminController.viewDashboard);

// END POINT CATEGORY
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.updateCategory);
router.delete("/category/:id", adminController.deleteCategory);

// BANK
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.updateBank);
router.delete("/bank/:id", adminController.deleteBank);

// ITEM
router.get("/item", adminController.viewItem);
// router.post("/item", upload, adminController.addItem);

// BOOKING
router.get("/booking", adminController.viewBooking);

module.exports = router;
