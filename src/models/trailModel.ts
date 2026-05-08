import { getDB } from "../models/db"

export interface Trail {
  id: number;
  region_id: number;
  title: string;
  slug: string;
  difficulty: string;
  distance_km: number;
  description: string;
  image_url: string;
  created_at: number;
}

const allTrailsQuery = `
    SELECT 
        t.*, 
        r.name AS regionName, 
        r.description AS regionDescription, 
        r.slug as regionSlug, 
        r.country as regionCountry 
    FROM trails t 
    JOIN regions r 
    ON t.region_id = r.id
`;

export async function getTrails(): Promise<Trail[]> {
  const db = getDB();
  return await db.all<Trail[]>(allTrailsQuery);
}

export async function getTrailBySlug(slug: string): Promise<Trail | undefined> {
  const db = getDB();
  return await db.get<Trail>(allTrailsQuery + " WHERE t.slug = ?", [ slug, ]);
}

export async function getTrailsByRegion(regionId: number) {
  const db = getDB();
  return await db.all<Trail[]>(allTrailsQuery + " WHERE t.region_id = ?", [ regionId, ]);
  
}