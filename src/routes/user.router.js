import express from "express";
import {
  current,
  changeRole,
  chargeProfileImg,
  chargeDocumentation,
  getUsers,
  deleteOldUsers,
  userAdminView,
  deleteUser,
} from "../controllers/user.controller.js";
import { uploadProfileImg, uploadProductImg, uploadDocImg } from "../middlewares.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/:uid/profileImg", uploadProfileImg, chargeProfileImg);
router.post("/:uid/documents", uploadDocImg, chargeDocumentation);
router.put("/premium/:uid", changeRole);
router.get("/current", current);
router.get("/admin", userAdminView);

router.delete("/", deleteOldUsers);
router.delete("/:uid", deleteUser);

export default router;
