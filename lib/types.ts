import { Timestamp } from "firebase/firestore";

export type Language = "fr" | "nl";

export interface Payment {
  amount: number;
  stripePaymentId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
  date: Date;
}

// Types
export interface Activity {
  id: string;
  titleFr: string;
  titleNl: string;
  subtitleFr: string;
  subtitleNl: string;
  descriptionFr: string;
  descriptionNl: string;
  duration: number; // in minutes
  equipmentPrice: number;
  startDate: Date;
  endDate: Date;
  specificDays: string[]; // ["monday", "wednesday", "friday"]
  excludedDays: Date[]; // specific dates without training
  dates: string[]; // formatted dates DD/MM/YYYY
  imageUrl?: string;
  imagePath?: string;
  createdAt: Date;
  updatedAt: Date;
  visible: boolean;
  link?: string;
}

export interface Session {
  id: string;
  name: string;
  activityId: string;
  numberOfSessions: number;
  pricePerSession: number;
  equipmentIncluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  activityId: string;
  name: string;
  startTime: string; // "13:00"
  maxPlayers: number;
  players: string[]; // player IDs
  waitingList: string[]; // player IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface PromoCode {
  id: string;
  name: string;
  code: string;
  amount: number;
  type: "percentage" | "fixed";
  activityId?: string;
  playerId?: string;
  validFrom: Timestamp | null;
  validUntil: Timestamp | null;
  usageLimit?: number;
  usageCount: number;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  sessionId: string;
  sessionData?: {
    numberOfSessions: number;
    pricePerSession: number;
  };
  dates: string[]; // reserved dates
  groupId: string;
  activityId: string;
  playerId: string;
  playerData?: {
    name: string;
    lastname: string;
    email: string;
    phone: string;
  };
  promoCode?: PromoCode;
  equipmentIncluded: boolean;
  tshirtSize?: string;
  shortSize?: string;
  payment: Payment;
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  lastname: string;
  dateOfBirth: Date;
  email: string;
  phone1: string;
  phone2?: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  club: string;
  lang: "fr" | "nl";
  note: string;
  groupIds: string[]; // group IDs
  activityIds: string[]; // activity IDs
  sessions: string[];
  books: string[]; // player's reservations IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryCategory {
  id: string;
  namefr: string;
  namenl: string;
  images: string[];
}
