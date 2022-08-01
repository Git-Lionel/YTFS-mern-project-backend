const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unkown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unkown : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unkown : " + req.params.id);

  try {
    // MODIF : Ajout de la variable const user en lien avec la modif indiquée ci-dessous
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
      // MODIF : Ci dessous mis en commentaire car ne marche pas. Ajout du de la ligne suivante à la place pour faire fonctionner tel qu'indiqué dans commentaires de la video YT
      //    (err, docs) => {
      //          if (!err) return res.send(docs);
      // if (err) return res.status(500).send({ message: err });
      //       }
    );
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unkown : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted." });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    // MODIF : Ajout de la variable const user en lien avec la modif indiquée ci-dessous
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
      // MODIF : Ci dessous mis en commentaire car ne marche pas. Ajout du de la ligne suivante à la place pour faire fonctionner tel qu'indiqué dans commentaires de la video YT
      // (err, docs) => {
      //   if (!err) res.status(201).json(docs);
      //   else return res.status(400).jsos(err);
      // }
    );
    res.status(200).json(user);
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
      // MODIF : Ci dessous mis en commentaire car ne marche pas. Ajout du de la ligne suivante à la place pour faire fonctionner tel qu'indiqué dans commentaires de la video YT
      // (err, docs) => {
      //   // if (!err) res.status(201).json(docs);
      //   if (err) return res.status(400).jsos(err);
      // }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // MODIF : Ajout de la variable const user en lien avec la modif indiquée ci-dessous
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
      // MODIF : Ci dessous mis en commentaire car ne marche pas. Ajout du de la ligne suivante à la place pour faire fonctionner tel qu'indiqué dans commentaires de la video YT
      // (err, docs) => {
      //   if (!err) res.status(201).json(docs);
      //   else return res.status(400).jsos(err);
      // }
    );
    res.status(200).json(user);
    // remove to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
      // MODIF : Ci dessous mis en commentaire car ne marche pas. Ajout du de la ligne suivante à la place pour faire fonctionner tel qu'indiqué dans commentaires de la video YT
      // (err, docs) => {
      //   // if (!err) res.status(201).json(docs);
      //   if (err) return res.status(400).jsos(err);
      // }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
