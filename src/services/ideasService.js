import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore"
import { db } from "./firebase"

// Collection reference — "ideas" is the Firestore collection name
// Think of it like a table in a regular database
const ideasCollection = collection(db, "ideas")

// ADD IDEA
// Saves a new idea to Firestore
// serverTimestamp() lets Firestore set the time — more reliable than client time
export const addIdea = async (userId, ideaData) => {
  try {
    const docRef = await addDoc(ideasCollection, {
      ...ideaData,          // title, description, mood
      userId,               // links idea to the logged in user
      createdAt: serverTimestamp(), // Firestore server time
      updatedAt: serverTimestamp(),
      maturity: "raw",      // all ideas start as raw
    })
    return docRef.id        // return the new idea's ID
  } catch (error) {
    console.error("Error adding idea:", error)
    throw error
  }
}

// GET IDEAS
// Fetches all ideas belonging to the logged in user
// ordered by newest first
export const getIdeas = async (userId) => {
  try {
    // query() filters ideas by userId so users only see their own
    // orderBy() sorts by creation time, newest first
    const q = query(
      ideasCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)

    // Map each Firestore document to a plain JS object
    // doc.id is the unique Firestore document ID
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching ideas:", error)
    throw error
  }
}

// UPDATE IDEA
// Merges partial updates into an existing idea document
// updatedAt is always overwritten with server time to keep audit trail accurate
export const updateIdea = async (ideaId, updates) => {
  try {
    await updateDoc(doc(db, "ideas", ideaId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating idea:", error)
    throw error
  }
}

// ADD EXPANSION
// Appends a new AI-generated expansion object to the idea's expansions array.
// arrayUnion prevents duplicates — safe to call even if the expansion already exists.
export const addExpansion = async (ideaId, expansion) => {
  try {
    await updateDoc(doc(db, "ideas", ideaId), {
      expansions: arrayUnion(expansion),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error adding expansion:", error)
    throw error
  }
}

// DELETE IDEA
// Permanently removes an idea from Firestore by its document ID
export const deleteIdea = async (ideaId) => {
  try {
    // doc() creates a reference to a specific document by ID
    await deleteDoc(doc(db, "ideas", ideaId))
  } catch (error) {
    console.error("Error deleting idea:", error)
    throw error
  }
}