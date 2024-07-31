import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.henkiws.mvideo',
    projectId: "66a3b4be003b8d26717c",
    databaseId: "66a3b677001f80aff4e8",
    userCollectionId: "66a3b6ab00322625134c",
    videoCollectionId: "66a3b730000d01d32d30",
    storageId: "66a3b8d400229c8cbaa0"
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

// register user
export async function createUser(email, password, username) {
    try {

        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        )

        return newUser
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session

    } catch(error) {
        console.log(error)
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;
    
        const currentUser = await databases.listDocuments(
          config.databaseId,
          config.userCollectionId,
          [Query.equal("accountId", currentAccount.$id)]
        );
    
        if (!currentUser) throw Error;
    
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        )

        return posts
    } catch(error) {
        throw new Error(error)
    } finally {

    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        )

        return posts
    } catch(error) {
        throw new Error(error)
    } finally {

    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search("title",query)]
        )

        if (!posts) throw new Error("Something went wrong");

        return posts
    } catch(error) {
        throw new Error(error)
    } finally {

    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal("creator",userId)]
        )

        if (!posts) throw new Error("Something went wrong");

        return posts
    } catch(error) {
        throw new Error(error)
    } finally {

    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current')
        return session;

    } catch(error) {
        throw new Error(error)
    } finally {

    }
}

export const getFilePreview = async (field, type) => {
    let fileUrl

    try {
        if( type === "video" ) {
            fileUrl = storage.getFileView(config.storageId, fileId)
        } else if( type === "image" ) {
            fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')    
        }

        if(!fileUrl) new Error

        return fileUrl
    } catch(error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    const { mimeType, ...rest } = file

    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.filesize,
        url: file.uri
     }

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadFile.$id, type)

        return fileUrl
    } catch(error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    try {
        const [thumnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'vide')
        ])

        const newPost = await databases.createDocument(
            config.databaseId, config.videoCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost
    } catch(error) {
        throw new Error(error)
    } finally {

    }
}