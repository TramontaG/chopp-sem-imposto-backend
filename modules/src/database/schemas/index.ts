import { FieldValue } from "firebase-admin/firestore";

type User = {
  id: string;
  name: string;
  phoneNumber: string;
  city: string;
  DOB: string | null; // YYYY-MM-DD
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

type Event = {
  id: string;
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  location: string;
  attendees: string[]; // List of user IDs
  bannerUrl: string; // Banner image URL
  medias: string[]; // List of media URLs
  organizer: string; // Organizer ID
  type: "chopp" | "cultural" | "other";

  hostContatInfo: string;
  comments: string[];

  createdAt: number;
  updatedAt: number;
  deletedAt: number | null; //soft delete
};

type Host = {
  id: string;
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
};

export type EntityTypes = keyof AllEntitiesModel;

export type WithID<T extends keyof AllEntitiesModel> = {
  id: string;
} & AllEntitiesModel[T];

export type DatabaseFriendlyEntityModel<T extends keyof AllEntitiesModel> = {
  [key in keyof WithID<T>]: FieldValue | WithID<T>[key];
};
