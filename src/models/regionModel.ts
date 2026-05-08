import { getDB } from "../models/db"

export interface Region {
  id: number;
  name: string;
  slug: string;
  country: string;
  description: string;
}

export async function getRegions(): Promise<Region[]> {
  const db = getDB();
  return await db.all<Region[]>("SELECT * FROM regions");
}

export async function getRegionBySlug(slug: string): Promise<Region | undefined> {
    const db = getDB();
    return await db.get<Region | undefined>("SELECT * FROM regions r WHERE r.slug = ?", [ slug ]);
}