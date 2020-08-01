import _ from 'lodash'
import { ObjectID, MongoClient } from 'mongodb'
const mongoClient = MongoClient.connect('mongodb://localhost:27017/JsStackDemo')

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

        const pingBack = await (<any>(await mongoClient)).collection(collection).findOneAndUpdate(

            { _id: id },
            { $set: body },
            { upsert: true, returnOriginal: false }
        )

        if (pingBack.lastErrorObject && pingBack.lastErrorObject.n === 0) {

            throw new Error("nothing was updated");
        }

        return pingBack.value
    },

    delete: async (collection, query) => {

        if (_.isEmpty(query)) {

            throw new Error('Body/query for deletion must not be empty');
        };

        if (query._id) {

            query = { _id: new ObjectID(query._id) }
        }

        const pingBack = await (<any>(await mongoClient)).collection(collection).remove(query)

        if (pingBack.result && pingBack.result.n === 0) {

            throw new Error('Object to delete was not found');
        }
    },

    getMany: async (collection, query) => {

        const pingback = await (<any>(await mongoClient)).collection(collection).find(query).toArray()

        return pingback
    },

    getOne: async (collection, id) => {

        if (!ObjectID.isValid(id)) {

            throw new Error('Invalid ObjectID')
        }

        var query = { _id: new ObjectID(id) };

        const result = (<any>await (await mongoClient)).collection(collection).findOne(query)

        if (!result) {

            throw new Error('None found');
        }

        return result;
    }
}
