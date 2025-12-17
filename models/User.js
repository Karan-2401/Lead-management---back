const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    password:{
       type: String,
      required: true,
    }
  },
  { timestamps: true }
);


User.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.post("deleteOne", {document: true, query: true }, async function () {
  try {
    await mongoose
      .model("Profile")
      .deleteOne({ user_id: this.phone });

    await mongoose
      .model("Lead")
      .updateMany(
        { assigned_to: this.phone },
        { $set: { assigned_to: null } }
      );

  } catch (err) {
    console.error(err);
  }
});

User.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", User);
