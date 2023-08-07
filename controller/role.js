
const { v4: uuidv4 } = require('uuid');
const finders = require('./../metadata/role.json')
const { Agg, countByQueryOtherFilter } = require('../common/json')
const Chance = require('chance');
const chance = new Chance();
const { filter, isEmptyObject, convertHashPassword, convertSingleItemToList } = require('./../utils/index')
const uniqueFields = ["name"]
const passwordFields = []

const roleCount = async (req, res) => {
    try {
        const { filter } = req.params
        const { db } = req
        
        const item = await db.collection("role").aggregate(Agg(finders, filter, 'count')).toArray()
        return res.status(200).json(item.length)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            msg: "internal server error",
            data: "",
            code: 500
        })
    }
}

const roleList = async (req, res) => {
    try {
        const { filter } = req.params
        const { db } = req
        
        const item = await db.collection("role").aggregate(Agg(finders, filter, 'list', req.query)).toArray()
        return res.status(200).json(item)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            msg: "internal server error",
            data: "",
            code: 500
        })
    }
}

const roleStoreData = async (req, res) => {
    try {
        const { filter } = req.params
        const { db } = req
        const data = req.body

        finders.fields.map((_doc, i) => {
            if(_doc.required){
                if(data[_doc.fieldName] == ''){
                    return res.status(400).json({
                        msg: _doc.fieldName+" must be required",
                        data: "",
                        code: 400
                    })
                }
            }
        })

        let _res = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: '',
            uuid: uuidv4(),
            isDeleted: false
        }

        const _result = await db.collection("role").insertOne(_res)
        
        return res.status(200).json(_result)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            msg: "internal server error",
            data: "",
            code: 500
        })
    }
}

const deleteItem = async (req, res) => {
    try {
        const { filter } = req.params
        const { db } = req

        const itemExist = await  db.collection("role").findOne({ uuid: filter })

        if(itemExist){
            await db.collection("role").updateOne({ uuid: filter }, { $set: { isDeleted: true }})
            return res.status(200).json()
        } else {
            return res.status(400).json({
                msg: "item not found",
                data: "",
                code: 400
            })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            msg: "internal server error",
            data: "",
            code: 500
        })
    }
}

const editItem = async (req, res) => {
    try {
        const { filter } = req.params
        const { db } = req
        const data = req.body

        let query = { uuid: filter },
            value = { $set: data }

        const _result = await db.collection("role").updateOne(query, value)
        return res.status(200).json(_result)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            msg: "internal server error",
            data: "",
            code: 500
        })
    }
}

const roleDetail = async (req, res) => {
    try {
        const { filter } = req.params
        const { db } = req

        const _result = await db.collection("role").findOne({ uuid: filter })
        
        return res.status(200).json(_result)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            msg: "internal server error",
            data: "",
            code: 500
        })
    }
}

const validateItemCollection = async (
  dbConnection,
  collection,
  itemData,
  itemId = null,
  isValidateFields = true,
  isUpdate = false,
  ) => {
  let { fields } = collection;
  let arr = Object.keys(itemData);
  let isExist = false;
  
  if (isValidateFields) {
      for (let obj of arr) {
      let find = fields.find((field) => field.fieldName === obj);
      if (!find) {
          delete itemData[obj];
          //isExist = obj;
          //break;
      }
      }
  }
  
  if (isExist) return { field: 0, isExist };
  
  const requireFields = fields.filter((field) => field.required);
  
  if (isUpdate) {
      for (const field of requireFields) {
      if (
          Object.prototype.hasOwnProperty.call(itemData, field.fieldName) &&
          !itemData[field.fieldName]
      ) {
          return { field: field.fieldTitle.en + ' field is required' };
      }
      }
  } else {
      for (const field of requireFields) {
      if (!itemData[field.fieldName]) {
          return { field: field.fieldTitle.en +"field is required" };
      }
      }
  }
  //Checking if data has unique data for unique fields
  let errorResponse = await validateUniqueFieldsKeyData(
      dbConnection,
      itemData,
      itemId,
  );
  if (isEmptyObject(errorResponse)) {
      //Checking if data of composite keys have unique data
      errorResponse = await validateCompositeKeyData(
      dbConnection,
      collection,
      itemData,
      itemId,
      );
  }
  return !isEmptyObject(errorResponse)
      ? { field: errorResponse ? errorResponse.message : errorResponse }
      : {};
}
      
const validateCompositeKeyData = async (
    dbConnection,
    collection,
    itemData,
    itemId,
    ) => {
    let errorJson = {};
    const { fields, constraints } = collection;
    const constraintsFields = constraints.find(
        (constraint) => constraint.constraintType === 'COMPOSITE',
    );
    if (constraintsFields) {
        const compositeFieldName = constraintsFields.fields.map((field) => field.value);
        let query = { project: {}, match: {} };
        if (itemId) {
        query.project['uuid'] = '$uuid';
        query.match['uuid'] = { $ne: itemId };
        }
        compositeFieldName.map((fieldName) => {
        const field = fields.find((field) => field.fieldName === fieldName);
        let fieldValue = itemData[fieldName];
        if (
            field.type === reference.id ||
            field.type === static_option.id ||
            field.type === dynamic_option.id
        ) {
            if (!Array.isArray(fieldValue)) {
            fieldValue = [fieldValue];
            }
            query.project[fieldName] = "$"+fieldName;
            query.match[fieldName] = { $in: fieldValue ? fieldValue : [] };
        } else {
            query.project[fieldName] = { $toLower: "$"+fieldName };
            query.match[fieldName] = { $eq: fieldValue ? fieldValue.toString() : fieldValue };
        }
        });
        try {
        const countResponse = await countByMultipleQuery(
            dbConnection,
            query,
        );
        if (countResponse > 0) {
            errorJson['compositeFieldError'] =
            'Already present data of these ' +
            constraintsFields.fields.map((field) => field.label).join(', ') +
            ' fields.';
        }
        } catch (e) {
        console.log('errr', e);
        // next(e)
        }
    }
    return errorJson;
}
      
const countByMultipleQuery = async (dbConnection,queryData) => {
    
    let query = [
        {
        $project: queryData.project,
        },
        {
        $match: queryData.match,
        },
        { $group: { _id: null, count: { $sum: 1 } } },
    ];
    let data = await dbConnection.collection("user").aggregate(query).toArray();
    if (data.length) return data[0].count;
    return;
}
    
const validateUniqueFieldsKeyData = async (
    dbConnection,
    itemData,
    itemId,
    ) => {
    let errorJson = {};
    let errors = await filter(uniqueFields, async (field) => {
        return (
        (await countByQueryOther(
            dbConnection,
            field,
            itemData[[field]],
            itemId,
        )) > 0
        );
    });
    errors.some((field) => {
        if (field) {
          errorJson.message = field && field.fieldTitle ? 'This ' +field.fieldTitle.en+ ' already exists' : 'This ' +field+ ' already exists';
          return true;
        }
    });
    return errorJson;
}
    
const countByQueryOther = async (
    dbConnection,
    fieldName,
    fieldValue,
    itemId,
    ) => {
    if (!fieldValue) return;
    
    let query = countByQueryOtherFilter({
      query: finders.countByQueryOther,
      fieldValue: fieldValue ? fieldValue.toString().toLowerCase() : fieldValue, 
      itemId, 
      fieldName: fieldName
  })
    
    let data = await dbConnection.collection("user").aggregate(query).toArray();
    if (data.length) return data[0].count;
    return;
}

const saveUserWithProvider = async (
    dbConnection,
    projectId,
    userData,
    provider,
) => {
    const collectionData = require("../metadata/role.json")
    if (!collectionData) {
    return { code: 404, data: "Collection not found with provided name" };
    }

    userData.password = userData.password ? userData.password : chance.string({ length: 10 });
    const errorJson = await validateItemCollection(
    dbConnection,
    collectionData,
    userData,
    null,
    false,
    );
    if (Object.keys(errorJson).length !== 0 && errorJson.field) {
    return {
        code: 409,
        message: 'Validation Failed',
        data: errorJson.field,
    };
    }

    let extraDocument = {};
    let uuid = '';

    if (provider) {
    let authResponse = await 
    (projectId, provider, userData);
    if (!authResponse.success) {
        return {
        code: authResponse.status,
        message: authResponse.message,
        data: authResponse.message,
        };
    }

    if (provider === PROVIDER_TYPE.FIREBASE) {
        const { localId, idToken } = authResponse.data;
        extraDocument = { idToken };
        uuid = localId;
    } else if (provider === PROVIDER_TYPE.XANO) {
        const { authToken, id, name } = authResponse.data;
        extraDocument = { authToken };
        if (name) {
        extraDocument = { ...extraDocument, name };
        }
        uuid = id;
    } else if (provider === PROVIDER_TYPE.BACKENDLESS) {
        const { authToken, ownerId, name } = authResponse.data;
        extraDocument = { authToken };
        if (name) {
        extraDocument = { ...extraDocument, name };
        }
        uuid = ownerId;
    }
    } else {
    uuid = uuidv4();
    }

    userData = await convertPasswordTypeFields(
    dbConnection,
    projectId,
    collectionData,
    userData,
    );
    userData = await convertSingleItemToList(collectionData, userData);
    userData = await convertStringDataToObject(collectionData, userData);
    userData.createdAt = new Date();
    userData.updatedAt = new Date();
    userData.uuid = uuid;

    userData = { ...userData, ...extraDocument };
    const savedItem = await dbConnection.collection("user").insertOne(userData);
    return {
    code: 201,
    message: 'Item Created Successfully',
    data: userData ? userData : {},
    // data: savedItem ? savedItem.ops[0] : {},
    };
}

const convertPasswordTypeFields = async (
    dbConnection,
    projectId,
    collection,
    itemData,
    itemId = null,
  ) => {
    if (passwordFields.length > 0) {
      await Promise.all(
        passwordFields.map(async (field) => {
          if (itemId) {
            const existingItem = await findItemById(
              dbConnection,
              projectId,
              collection.collectionName,
              itemId,
            );
            if (existingItem[field] !== itemData[field]) {
              itemData[field] = await convertHashPassword(itemData[field]);
            }
          } else {
            itemData[field] = await convertHashPassword(itemData[field]);
          }
        }),
      );
    }
    return itemData;
}

const convertStringDataToObject = async (collection, itemData) => {
    const fileUploadFields = collection.fields.filter(
        (field) => field.type === "image" || field.type === "file" || field.type === "multi_image",
    );
    if (fileUploadFields.length > 0) {
        await Promise.all(
        fileUploadFields.map(async (field) => {
            const fieldValue = itemData[field.fieldName];

            if (fieldValue && typeof fieldValue === 'string') {
            itemData[field.fieldName] = parseJsonString(fieldValue);
            }
        }),
        );
    }
    return itemData;
}

const findOneroleItemByQuery = async (
  dbConnection,
  projectRemoteDb,
  query
) => {
  let dbCollection = null;
  if (projectRemoteDb) {
    dbCollection = await projectRemoteDb.collection("role");
  } else {
    dbCollection = await dbConnection.collection("role");
  }

  const res = await dbCollection.findOne(query);
  return res;
};



const findroleItemById = async (
  dbConnection,
  projectRemoteDb,
  itemId,
  initialQuery
) => {
  let query = [{
    $match: initialQuery ? initialQuery : {
      uuid: itemId
    }
  }];
  const {
    referenceAndMultiReference
  } = finders;

  let dbCollection = null;
  query = query.concat(referenceAndMultiReference);

  if (projectRemoteDb) {
    dbCollection = await projectRemoteDb.collection("role");
  } else {
    dbCollection = await dbConnection.collection("role");
  }
  let result = await dbCollection.aggregate(query).toArray();

  if (!result.length) {
    return {
      code: 404,
      message: "Item not found with provided id"
    };
  }
  return {
    code: 200,
    message: "success",
    data: result[0]
  };
};

module.exports = {
  roleDetail,
  editItem,
  deleteItem,
  roleStoreData,
  roleList,
  roleCount,
  saveUserWithProvider,
  convertPasswordTypeFields,
  convertStringDataToObject,
  validateUniqueFieldsKeyData,
  countByQueryOther,
  validateItemCollection,
  validateCompositeKeyData,
  countByMultipleQuery,
  findOneroleItemByQuery,
  findroleItemById,
  
}