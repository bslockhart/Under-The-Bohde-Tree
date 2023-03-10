const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
        console.log(userData);
        return userData;
      }
      throw new AuthenticationError("Not logged in!");
    },
    // GET all users
    users: async () => {
      return User.find()
        .select("-__v -password")
    },
    // GET a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
    },

    getUserTrade: async (parent, { bookId }) => {
      return User.find({ "savedBooks.bookId": bookId }).select(
        "-__v -password"
      );
    },
    getUserWish: async (parent, { bookId }) => {
      return User.find({ "wishList.bookId": bookId }).select("-__v -password");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Your email or password dont match!");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Please enter correct email or password");
      }

      const token = signToken(user);
      return { token, user };
    },

    updateUser: async (parent, { id, email }) => {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { email },
        { new: true }
      );

      return user;
    },

    saveBook: async (parent, args, context) => {
      console.log("saveBook");
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.input } },
          { new: true, runValidators: true }
        );
        return updateUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    addWish: async (parent, args, context) => {
      console.log("saveBook");
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { wishList: args.input } },
          { new: true, runValidators: true }
        );
        return updateUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },


    removeWish: async (parent, { bookId }, context) => {
      console.log(context.user, bookId);
      if (context.user) {
        const updateSavedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { wishList: { bookId } } },
          { new: true }
        );
        console.log(updateSavedBooks);
        return updateSavedBooks;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
      console.log(context.user, bookId);
      if (context.user) {
        const updateSavedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        console.log(updateSavedBooks);
        return updateSavedBooks;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    toggleTradeBool: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
            .select("-__v -password")
            .populate("savedBooks"),
          savedBooks = userData.savedBooks,
          bookId = args.bookId,
          book = savedBooks.find((book) => book.bookId === bookId);
        console.log(book)
        if (book) {
          book.tradeBool = !book.tradeBool;
          await User.updateOne(
            { _id: context.user._id },
            { savedBooks: savedBooks }
          );
        }

        return userData;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    setRating: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
            .select("-__v -password")
            .populate("books"),
          savedBooks = userData.savedBooks,
          bookId = args.bookId,
          rating = args.rating,
          book = savedBooks.find((book) => book.bookId === bookId);

        if (book) {
          book.rating = rating;
          await User.updateOne(
            { _id: context.user._id },
            { savedBooks: savedBooks },
            { runValidators: true }
          );
        }

        return userData;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
