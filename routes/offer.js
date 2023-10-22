const express = require("express");
const fileUpload = require("express-fileupload"); // le middleware fileUpload permet de lire les form data
const cloudinary = require("cloudinary").v2;
const Offer = require("../models/Offer");
const convertToBase64 = require("../utils/convertToBase64");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const pictureUrl = await cloudinary.uploader.upload(
        convertToBase64(req.files.picture)
      );
      console.log(req.user);
      const newOffer = new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          { MARQUE: req.body.brand },
          { TAILLE: req.body.size },
          { ETAT: req.body.condition },
          { COULEUR: req.body.color },
          { EMPLACEMENT: req.body.city },
        ],
        owner: req.user,
        product_image: {
          secure_url: pictureUrl.secure_url,
        },
      });

      await newOffer.save();
      await newOffer.populate("owner", "account _id");

      res.status(200).json(newOffer);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
