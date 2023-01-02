import { initializeApp } from "firebase/app";
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  storageBucket: 'gs://pinpal-8f887.appspot.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, '/');
  
export async function addImage(file: File) {
  const fileRef = ref(storage, file.name);
  return await uploadBytes(fileRef, file)
    .then(async (snapshot) => {
      const url = await getDownloadURL(snapshot.ref);
      return url;
    })
    .then((url) => {
      return { data: url }
    })
    .catch((e) => {
      console.log('ERROR', e)
      return { data: '' }
    });
}

export async function deleteImage(fileUrl: string) {
  const fileRef = ref(storage, fileUrl);
  return await deleteObject(fileRef)
    .then(async (snapshot) => {
      return {data: fileUrl};
    })
    .catch((e) => {
      console.log('ERROR', e)
      return {data: null}
    });
}

export async function fetchImages() {
  try {
    return await listAll(storageRef)
      .then( (res) => {
        const promises: Promise<string>[] = res.items.map((i) => getDownloadURL(i).then((url) => url))
        return Promise.all(promises)
      })
      .then((urls) => {
        return { data: urls }
      })
  } catch { 
    return Promise.resolve({ data: []});
  }
}
