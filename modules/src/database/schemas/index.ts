import { FieldValue } from "firebase-admin/firestore";

type User = {
  name: string;
  phoneNumber: string;
  city: string;
  DOB: number | null; // YYYY-MM-DD
  sex: "m" | "f" | null;
  neighborhood: string | null;
  profession: string | null;
  confirmed: boolean;
  source: `whatsapp-${string}` | "novo" | "website" | "instagram" | "referral";
  eventsAttended: string[]; // List of event IDs
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null; //soft delete
};

type Admin = {
  name: string;
  username: string;
  salt: string;
  passwordHash: string;
  permissions: string[];

  createdAt: number;
  updatedAt: number;
  deletedAt: number | null; //soft delete
};

type Event = {
  name: string;
  description: string;
  date: number;
  location: string;
  invited: string[]; // List of user IDs
  attendees: string[]; // List of user IDs
  interested: string[]; // List of user IDs
  bannerUrl: string | null; // Banner image URL
  medias: string[]; // List of media URLs
  organizer: string | null; // Organizer ID
  type: "chopp" | "cultural" | "other";
  hostContatInfo: string | null;
  comments: string[];
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null; //soft delete
};

type Host = {
  userData: string | null; // Link to user ID if exists
  name: string;
  phoneNumber: string;
  email: string | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null; //soft delete
};

export type AllEntitiesModel = {
  user: User;
  event: Event;
  host: Host;
  admin: Admin;
};

export type EntityTypes = keyof AllEntitiesModel;

export type WithID<T extends keyof AllEntitiesModel> = {
  id: string;
} & AllEntitiesModel[T];

export type DatabaseFriendlyEntityModel<T extends keyof AllEntitiesModel> = {
  [key in keyof WithID<T>]: FieldValue | WithID<T>[key];
};
