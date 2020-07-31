const _ = require('lodash')
const { ObjectID, MongoClient } = require('mongodb')
const mongoClient = MongoClient.connect('mongodb://localhost:27017/JsStackDemo')

module.exports = {

    upsert: async (collection, body, id) => {

        id = !id ? new ObjectID() : ObjectID(id);

        body = _.omit(body, ['_id']);

        if (_.isEmpty(body)) {

            throw new Error({ status: 400, message: 'body must not be empty' });
        }

        if (!ObjectID.isValid(id)) {

            throw new Error({ status: 400, message: 'ObjectID is of incorrect format/type' });
        }

        const pingBack = await (await mongoClient).collection(collection).findOneAndUpdate(
 
            { _id: id },
            { $set: body },
            { upsert: true, returnOriginal: false }
        )

        if (pingBack.lastErrorObject && pingBack.lastErrorObject.n === 0) {

            throw new Error({ status: 404, message: "nothing was updated" });
        }

        return pingBack.value

    },

    delete: async (collection, query) => {

        if (_.isEmpty(query)) {

            throw new Error({ status: 500, message: 'Body/query for deletion must not be empty' });
        };

        const pingBack = await (await mongoClient).collection(collection)

        if (pingBack.result && pingBack.result.n === 0) {

            throw new Error({ status: 404, message: 'Object to delete was not found' });
        }

        return pingback
    },

    getMany: async (collection, query) => {

        const pingback = await (await mongoClient).collection(collection).find(query).toArray()

        return pingback
    },

    getOne: async (collection, id) => {

        if (!ObjectID.isValid(id)) {

            throw new Error({ status: 404, message: 'Invalid ObjectID' })
        }

        var query = { _id: ObjectID(id) };

        const result = await(await mongoClient).collection(collection).findOne(query)

        if (!result) {

            throw new Error({ status: 404, message: 'None found' });
        }

        return result;
    }
}
