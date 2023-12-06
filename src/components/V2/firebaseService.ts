import { firestore } from '../../firebase/config'; // Adjust import path as necessary
import { collection, getDocs, addDoc, doc, updateDoc, query, where, QueryConstraint, getDoc } from 'firebase/firestore';
import { UserType, ExerciseSet, Exercise, WorkoutDay, WorkoutPlan } from '../../types'; // Adjust import path as necessary

type FirestoreData = UserType | ExerciseSet | Exercise | WorkoutDay | WorkoutPlan;

const fetchData = async <T extends FirestoreData>(path: string, constraints: QueryConstraint[] = []): Promise<T[]> => {
    const ref = collection(firestore, path);
    const q = constraints.length ? query(ref, ...constraints) : query(ref);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

const addData = async <T extends FirestoreData>(path: string, data: T): Promise<T> => {
    const ref = collection(firestore, path);
    const docRef = await addDoc(ref, data);
    return { ...data, id: docRef.id } as T;
};

const updateData = async (path: string, data: any): Promise<void> => {
    const docRef = doc(firestore, path);
    await updateDoc(docRef, data);
};
const fetchDocument = async <T>(docPath: string): Promise<T> => {
    const docRef = doc(firestore, docPath);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        throw new Error('No such document!');
    }
    return { id: docSnap.id, ...docSnap.data() } as T;
};




export { fetchData, addData, updateData, fetchDocument };
