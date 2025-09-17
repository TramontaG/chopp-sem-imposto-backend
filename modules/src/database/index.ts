import { Query } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import type {
  DatabaseFriendlyEntityModel,
  EntityTypes,
  WithID,
} from "./schemas";
import firebase from "../Firebase";

export const db = getFirestore(firebase);

export const DbManager = <EntityType extends EntityTypes>(
  collection: EntityType
) => {
  const dbCollection = db.collection(collection);

  const upsertEntity = (
    id: string,
    data: Partial<DatabaseFriendlyEntityModel<"user">>
  ) => {
    return dbCollection.doc(id).set(
      {
        ...data,
        id,
        updatedAt: Date.now(),
      },
      {
        merge: true,
      }
    );
  };

  const readEntity = (id: string) => {
    return dbCollection
      .doc(id)
      .get()
      .then((doc) => doc.data() as WithID<EntityType>);
  };

  const deleteEntity = (id: string) => {
    return upsertEntity(id, {
      deletedAt: Date.now(),
    });
  };

  const hardDelete = (id: string) => dbCollection.doc(id).delete();

  const entityExists = (id: string) => {
    return dbCollection
      .doc(id)
      .get()
      .then((doc) => doc.exists);
  };

  const createQuery = (cb: (queryBuilder: Query) => Query) => {
    return cb(dbCollection);
  };

  const runQuery = (query: Query) => {
    return query.get().then((result) => {
      return result.docs.map((doc) => doc.data() as WithID<EntityType>);
    });
  };

  const countByQuery = (query: Query) => {
    return query
      .count()
      .get()
      .then((result) => result.data().count);
  };

  return {
    upsertEntity,
    countByQuery,
    readEntity,
    deleteEntity,
    hardDelete,
    entityExists,
    createQuery,
    runQuery,
  };
};

export default DbManager;
