import _ from 'lodash'
import { ObjectID, MongoClient, Db } from 'mongodb'

let _db: Db

MongoClient.connect('mongodb://localhost:27017', (err, connection) => {

    if (err) {

        throw new Error(err.message)
    }

    _db = connection.db('JsStackDemo')
})

type dbType = {

    upsert: (collection: string, body: any, id?: any) => {},

    delete: (collection: string, query: any) => {},

    getMany: (collection: string, query: any) => {},

    getOne: (collection: string, id: any) => {}
}

export const db: dbType = {

    upsert: async (collection, body, id) => {

        id = !id ? new ObjectID() : new ObjectID(id);

        body = _.omit(body, ['_id']);

        if (_.isEmpty(body)) {

            throw new Error('body must not be empty');
        }

        if (!ObjectID.isValid(id)) {

            throw new Error('ObjectID is of incorrect format/type');
        }

        const { lastErrorObject, value } = await _db.collection(collection).findOneAndUpdate(

            { _id: id },
            { $set: body },
            { upsert: true, returnOriginal: false }
        )

        if (lastErrorObject && lastErrorObject.n === 0) {

            throw new Error("nothing was updated");
        }

        return value
    },

    delete: async (collection, query) => {

        if (_.isEmpty(query)) {

            throw new Error('Body/query for deletion must not be empty');
        };

        if (query._id) {

            query = { _id: new ObjectID(query._id) }
        }

        const { result } = await _db.collection(collection).remove(query)

        if (result && result.n === 0) {

            throw new Error('Object to delete was not found');
        }
    },

    getMany: async (collection, query) => {

        const pingback = await _db.collection(collection).find(query).toArray()

        return pingback
    },

    getOne: async (collection, id) => {

        if (!ObjectID.isValid(id)) {

            throw new Error('Invalid ObjectID')
        }

        var query = { _id: new ObjectID(id) };

        const result = await _db.collection(collection).findOne(query)

        if (!result) {

            throw new Error('None found');
        }

        return result;
    }
}
