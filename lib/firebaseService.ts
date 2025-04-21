import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

import {
  Language,
  Payment,
  Activity,
  Session,
  Group,
  PromoCode,
  Reservation,
  GalleryCategory,
} from "@/lib/types";

// Service d'activités
export const activitiesService = {
  // Récupérer toutes les activités
  getAll: async (): Promise<Activity[]> => {
    const activitiesCollection = collection(db, "activities");
    const activitiesQuery = query(
      activitiesCollection,
      where("visible", "==", true)
    );
    const snapshot = await getDocs(activitiesQuery);
    const activities = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Activity)
    );

    // Tri des activités par date de création (du plus récent au plus ancien)
    return activities.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  // Récupérer une activité par ID
  getById: async (id: string): Promise<Activity | null> => {
    const docRef = doc(db, "activities", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Activity;
    }

    return null;
  },

  // Créer une nouvelle activité
  create: async (data: Omit<Activity, "id">): Promise<string> => {
    const docRef = await addDoc(collection(db, "activities"), data);
    return docRef.id;
  },

  // Mettre à jour une activité
  update: async (id: string, data: Partial<Activity>): Promise<void> => {
    const docRef = doc(db, "activities", id);
    await updateDoc(docRef, data);
  },

  // Supprimer une activité
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "activities", id);
    await deleteDoc(docRef);
  },
};

// Service de groupes
export const groupsService = {
  // Récupérer tous les groupes
  getAll: async (): Promise<Group[]> => {
    const groupsCollection = collection(db, "groups");
    const snapshot = await getDocs(groupsCollection);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Group)
    );
  },

  // Récupérer un groupe par ID
  getById: async (id: string): Promise<Group | null> => {
    const docRef = doc(db, "groups", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Group;
    }

    return null;
  },

  // Récupérer les groupes par ID d'activité
  getByActivityId: async (activityId: string): Promise<Group[]> => {
    const groupsCollection = collection(db, "groups");
    const q = query(groupsCollection, where("activityId", "==", activityId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Group)
    );
  },

  // Créer un nouveau groupe
  create: async (data: Omit<Group, "id">): Promise<string> => {
    const docRef = await addDoc(collection(db, "groups"), data);
    return docRef.id;
  },

  // Mettre à jour un groupe
  update: async (id: string, data: Partial<Group>): Promise<void> => {
    const docRef = doc(db, "groups", id);
    await updateDoc(docRef, data);
  },

  // Supprimer un groupe
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "groups", id);
    await deleteDoc(docRef);
  },
};

// Service de codes promo
export const promoCodesService = {
  // Récupérer tous les codes promo
  getAll: async (): Promise<PromoCode[]> => {
    const promoCodesCollection = collection(db, "promoCodes");
    const snapshot = await getDocs(promoCodesCollection);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as PromoCode)
    );
  },

  // Récupérer un code promo par ID
  getById: async (id: string): Promise<PromoCode | null> => {
    const docRef = doc(db, "promoCodes", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as PromoCode;
    }

    return null;
  },

  // Récupérer un code promo par son code
  getByCode: async (code: string): Promise<PromoCode | null> => {
    const q = query(collection(db, "promoCodes"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as PromoCode;
    }

    return null;
  },

  // Créer un nouveau code promo
  create: async (data: Omit<PromoCode, "id">): Promise<string> => {
    const docRef = await addDoc(collection(db, "promoCodes"), data);
    return docRef.id;
  },

  // Mettre à jour un code promo
  update: async (id: string, data: Partial<PromoCode>): Promise<void> => {
    const docRef = doc(db, "promoCodes", id);
    await updateDoc(docRef, data);
  },

  // Supprimer un code promo
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "promoCodes", id);
    await deleteDoc(docRef);
  },
};

// Service de sessions
export const sessionsService = {
  // Récupérer toutes les sessions
  getAll: async (): Promise<Session[]> => {
    const sessionsCollection = collection(db, "sessions");
    const snapshot = await getDocs(sessionsCollection);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Session)
    );
  },

  // Récupérer les sessions par activité
  getByActivity: async (activityId: string): Promise<Session[]> => {
    const q = query(
      collection(db, "sessions"),
      where("activityId", "==", activityId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Session)
    );
  },

  // Récupérer une session par ID
  getById: async (id: string): Promise<Session | null> => {
    const docRef = doc(db, "sessions", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Session;
    }

    return null;
  },

  // Créer une nouvelle session
  create: async (data: Omit<Session, "id">): Promise<string> => {
    const docRef = await addDoc(collection(db, "sessions"), data);
    return docRef.id;
  },

  // Mettre à jour une session
  update: async (id: string, data: Partial<Session>): Promise<void> => {
    const docRef = doc(db, "sessions", id);
    await updateDoc(docRef, data);
  },

  // Supprimer une session
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "sessions", id);
    await deleteDoc(docRef);
  },
};

// Service de réservations
export const reservationsService = {
  // Récupérer toutes les réservations
  getAll: async (): Promise<Reservation[]> => {
    const reservationsCollection = collection(db, "reservations");
    const snapshot = await getDocs(reservationsCollection);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Reservation)
    );
  },

  // Récupérer les réservations par session
  getBySession: async (sessionId: string): Promise<Reservation[]> => {
    const q = query(
      collection(db, "reservations"),
      where("sessionId", "==", sessionId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Reservation)
    );
  },

  // Récupérer les réservations par utilisateur
  getByUser: async (userId: string): Promise<Reservation[]> => {
    const q = query(
      collection(db, "reservations"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Reservation)
    );
  },

  // Récupérer une réservation par ID
  getById: async (id: string): Promise<Reservation | null> => {
    const docRef = doc(db, "reservations", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Reservation;
    }

    return null;
  },

  // Créer une nouvelle réservation
  create: async (data: Omit<Reservation, "id">): Promise<string> => {
    const docRef = await addDoc(collection(db, "reservations"), data);
    return docRef.id;
  },

  // Mettre à jour une réservation
  update: async (id: string, data: Partial<Reservation>): Promise<void> => {
    const docRef = doc(db, "reservations", id);
    await updateDoc(docRef, data);
  },

  // Supprimer une réservation
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "reservations", id);
    await deleteDoc(docRef);
  },
};

// Service de galerie
export const galleryService = {
  // Récupérer toutes les catégories de la galerie
  getAll: async (): Promise<GalleryCategory[]> => {
    const galleryCollection = collection(db, "gallery");
    const snapshot = await getDocs(galleryCollection);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as GalleryCategory)
    );
  },

  // Récupérer une catégorie par ID
  getById: async (id: string): Promise<GalleryCategory | null> => {
    const docRef = doc(db, "galery", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as GalleryCategory;
    }

    return null;
  },

  // Créer une nouvelle catégorie
  create: async (data: Omit<GalleryCategory, "id">): Promise<string> => {
    const docRef = await addDoc(collection(db, "galery"), data);
    return docRef.id;
  },

  // Mettre à jour une catégorie
  update: async (id: string, data: Partial<GalleryCategory>): Promise<void> => {
    const docRef = doc(db, "galery", id);
    await updateDoc(docRef, data);
  },

  // Supprimer une catégorie
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, "galery", id);
    await deleteDoc(docRef);
  },

  // Ajouter une image à une catégorie
  addImage: async (categoryId: string, imageUrl: string): Promise<void> => {
    const docRef = doc(db, "galery", categoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const category = docSnap.data() as GalleryCategory;
      const images = category.images || [];
      
      await updateDoc(docRef, {
        images: [...images, imageUrl],
      });
    }
  },

  // Supprimer une image d'une catégorie
  removeImage: async (categoryId: string, imageUrl: string): Promise<void> => {
    const docRef = doc(db, "galery", categoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const category = docSnap.data() as GalleryCategory;
      const images = category.images || [];
      
      await updateDoc(docRef, {
        images: images.filter(img => img !== imageUrl),
      });
    }
  },
};
