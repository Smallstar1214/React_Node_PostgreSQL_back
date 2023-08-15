const express = require("express");
const router = express.Router();

const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/user");

router.route("/").get(getUsers);
router.route("/:id").get(getUserById);
router.route("/").post(createUser);
router.route("/:id").put(updateUser);
router.route("/:id").delete(deleteUser);

module.exports = router;