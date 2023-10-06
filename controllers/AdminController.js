const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
// const Image = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // Dashboard
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", {
      title: "Staycation | Dashboard",
    });
  },

  // Category
  viewCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/category/view_category", {
        categories,
        alert,
        title: "Staycation | Category",
      });
    } catch (err) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Success Add Category!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Success Update Category!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.deleteOne();
      req.flash("alertMessage", "Success Delete Category!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  // BANK
  viewBank: async (req, res) => {
    try {
      const banks = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/bank/view_bank", {
        title: "Staycation | Bank",
        banks,
        alert,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { nameBank, nomorRekening, name } = req.body;
      await Bank.create({
        nameBank,
        nomorRekening,
        name,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Success Add bank!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  updateBank: async (req, res) => {
    try {
      const { id, nameBank, nomorRekening, name } = req.body;
      const bank = await Bank.findOne({ _id: id });

      if (req.file === undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash("alertMessage", "Success Update bank!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Success Update bank!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.deleteOne();
      req.flash("alertMessage", "Success Delete Bank!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  // Item
  viewItem: async (req, res) => {
    try {
      const categories = await Category.find();
      const items = await Item.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/item/view_item", {
        title: "Staycation | Item",
        items,
        categories,
        alert,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, description } = req.body;

      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });

        const newItem = {
          categoryId: category._id,
          title,
          price,
          city,
          description,
          imageUrl: `images/${req.file.filename}`,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await Category.save();

        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files.filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }

        req.flash("alertMessage", "Success Add Item!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  updateItem: async (req, res) => {
    try {
      const { id, categoryId, title, price, city, description } = req.body;
      const bank = await Bank.findOne({ _id: id });

      if (req.file === undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash("alertMessage", "Success Update bank!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Success Update bank!");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.deleteOne();
      req.flash("alertMessage", "Success Delete Bank!");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  // Booking
  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking", {
      title: "Staycation | Booking",
    });
  },
};
