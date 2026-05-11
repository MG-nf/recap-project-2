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

export type TrailPatch = Partial<
  Pick<Trail, "title" | "region_id" | "difficulty" | "distance_km" | "description" | "image_url" >
>

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

export async function getTrailById(id: number): Promise<Trail | undefined> {
  const db = getDB();
  return await db.get<Trail>(allTrailsQuery + " WHERE t.id = ?", [ id,]);
}

export async function getTrailBySlug(slug: string): Promise<Trail | undefined> {
  const db = getDB();
  return await db.get<Trail>(allTrailsQuery + " WHERE t.slug = ?", [ slug, ]);
}

export async function getTrailsByRegion(regionId: number) {
  const db = getDB();
  return await db.all<Trail[]>(allTrailsQuery + " WHERE t.region_id = ?", [ regionId, ]); 
}

export async function addTrail(trail: Omit<Trail, "id">): Promise<number> {
  const db = getDB();
  const result = await db.run(`
    INSERT INTO trails (
      title,
      slug,
      region_id,
      difficulty,
      distance_km,
      image_url,
      description,
      created_at
    ) VALUES (
      $title,
      $slug,
      $region,
      $difficulty,
      $distance,
      $image,
      $description,
      $createdAt
    )`,
  {
    $title: trail.title,
    $slug: trail.slug,
    $region: trail.region_id,
    $difficulty: trail.difficulty,
    $distance: trail.distance_km,
    $image: trail.image_url,
    $description: trail.description,
    $createdAt: trail.created_at
  });

  return result.lastID!;
}

export async function updateTrail(
  id: number, 
  title: string, 
  slug: string, 
  region: number, 
  difficulty: string, 
  distance: number, 
  image: string, 
  description: string
) {
  const db = getDB();
  db.run(`
    UPDATE trails 
    SET title = $title, 
      slug = $slug, 
      region_id = $region, 
      difficulty = $difficulty, 
      distance_km = $distance, 
      image_url = $image, 
      description = $description
    WHERE id=$id`, 
    { 
      $title: title,
      $slug: slug,
      $region: region,
      $difficulty: difficulty,
      $distance: distance,
      $image: image,
      $description: description,
      $id: id
    }
  );
  return;
}

export async function patchTrail(id: number, entries: [string, string|number][]) {
  const setClause = entries
    .map(([key]) => `${key} = ?`)
    .join(", ")

  const values = entries.map(([, value]) => value)

  const sql = `
    UPDATE trails
    SET ${setClause}
    WHERE id = ?
  `
  const db = getDB();
  await db.run(sql, [...values, id])
}

export async function deleteTrail(id: number) {
  const db = getDB();
  db.run("DELETE FROM trails WHERE id = ?", [ id ]);
  return;
}