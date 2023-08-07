const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltingRounds = 10;

const isEmptyObject = (object) => {
  return Object.keys(object).length === 0 && object.constructor === Object;
};

const filter = async (arr, callback) => {
  const fail = Symbol();
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i) => i !== fail);
};

const convertSingleItemToList = async (collection, itemData) => {
  const arrayOptionFields = collection.fields.filter((field) => {
    const { type } = field;
    return (
      type === "static_option" ||
      type === "dynamic_option" ||
      type === "reference"
    );
  });
  const fieldsInItemData = Object.keys(itemData);
  if (arrayOptionFields.length > 0) {
    await Promise.all(
      arrayOptionFields.map(async (field) => {
        if (fieldsInItemData.includes(field.fieldName))
          itemData[field.fieldName] = itemData[field.fieldName]
            ? convertItemToArray(itemData[field.fieldName])
            : [];
      })
    );
  }
  return itemData;
};

const convertItemToArray = function (itemValue) {
  if (Array.isArray(itemValue)) {
    return itemValue;
  }
  return [itemValue];
};

const convertHashPassword = function (password) {
  return bcrypt.hash(password, saltingRounds);
};

const JWT_SECRET_KEY =
  "addjsonwebtokensecretherelikeQuiscustodietipsoscustodes";

const jwtOptions = {
  expiresIn: "30m",
  algorithm: "HS256", //default: HS256
};

const issueJWTToken = (userData) => {
  const payload = {
    sub: userData.username || userData.userName || userData.email,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, JWT_SECRET_KEY, jwtOptions);

  return {
    token: "Bearer " + signedToken,
    expires: jwtOptions.expiresIn,
  };
};

const compareBcryptPassword = function (password, dbPassword) {
  return bcrypt.compare(password, dbPassword);
};

const verifyToken = (jwtToken) => {
  try {
    if (jwtToken.startsWith('Bearer ')) {
      jwtToken = jwtToken.substring(7, jwtToken.length);
    }
    return jwt.verify(jwtToken, JWT_SECRET_KEY, jwtOptions);
  } catch (e) {
    console.log('e: verify token ', e.message);
    return null;
  }
};

module.exports = {
  convertItemToArray,
  convertSingleItemToList,
  filter,
  isEmptyObject,
  convertHashPassword,
  compareBcryptPassword,
  saltingRounds,
  JWT_SECRET_KEY,
  jwtOptions,
  issueJWTToken,
  verifyToken
};
