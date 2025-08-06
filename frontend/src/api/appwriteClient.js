import { Client, Databases, ID, Query } from 'appwrite';

const databases = new Databases(client);

const DATABASE_ID = 'Your_Database_ID_Here';
const COLLECTION_ID_BOOKMARKS = 'Your_Bookmarks_Collection_ID_Here';

export const addBookmark = async (userId, coinId) => {
  return await databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID_BOOKMARKS,
    ID.unique(),
    {
      userId: userId,
      coinId: coinId,
    },
    [
      Permission.read(`user:${userId}`),
      Permission.update(`user:${userId}`),
      Permission.delete(`user:${userId}`),
    ]
  );
};

export const getBookmarks = async (userId) => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID_BOOKMARKS,
    [Query.equal('userId', [userId])]
  );
  return response.documents.map((doc) => doc.coinId);
};

export const removeBookmark = async (documentId) => {
  return await databases.deleteDocument(
    DATABASE_ID,
    COLLECTION_ID_BOOKMARKS,
    documentId
  );
};
