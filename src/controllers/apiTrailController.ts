import type { Trail, TrailPatch } from "../models/trailModel";
import { getTrails, getTrailBySlug, getTrailsByRegion, addTrail, patchTrail, deleteTrail, getTrailById } from "../models/trailModel";
import { getRegionBySlug } from "../models/regionModel";
import type { Request, Response } from "express";
import sanitize from "sanitize-html";

export async function fetchTrails(_req: Request, res: Response):Promise<void> {
    // todo: optional ?region=<slug> and ?difficulty=<easy|moderate|hard> filters via req.query
    const trails = await getTrails();
    if(!trails) {
      res.status(404).json({"message": "No trails found"});
      return;
    }
    res.json(trails);
}

export async function fetchTrailBySlug(req: Request, res: Response): Promise<void> {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).json({"message": "Invalid slug"});
      return;
    }

    const trail = await(getTrailBySlug(slug));
    if(!trail) {
      res.status(404).json({"message": "Trail not found"});
      return;
    }
    res.json(trail);
}

export async function fetchTrailsByRegion(req: Request, res: Response): Promise<void> {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).json({"message": "Invalid slug"});
      return;
    }

    const region = await getRegionBySlug(slug);
    if(!region) {
      res.status(404).json({"message": "Region not found"});
      return;
    }

    const trails = await getTrailsByRegion(region.id);
    if(!trails) {
      res.status(404).json({"message": "No trails found"});
      return;
    }
    res.json(trails);

}

export async function createTrail(req: Request, res: Response): Promise<void> {
    const newTrail: Omit<Trail, "id"> = req.body;

    if (!newTrail.title) {
        res.status(400).json({ "error": "Missing required field: title" });
        return;
    }

    if (!newTrail.region_id) {
        res.status(400).json({ "error": "Missing required field: region_id" });
        return;
    }

    if (!newTrail.difficulty) {
        res.status(400).json({ "error": "Missing required field: difficulty" });
        return;
    }

    if (!newTrail.distance_km) {
        res.status(400).json({ "error": "Missing required field: distance_km" });
        return;
    }

    if (!newTrail.description) {
        res.status(400).json({ "error": "Missing required field: description" });
        return;
    }

    if (!newTrail.image_url) {
        res.status(400).json({ "error": "Missing required field: region_id" });
        return;
    }

    newTrail.slug = slugify(newTrail.title);
    newTrail.description = sanitize(newTrail.description);
    newTrail.created_at = Math.floor(Date.now() / 1000);

    try {
        const lastID = await addTrail(newTrail);
        const newPersistedTrail = await getTrailById(lastID);
        // todo: verify Trail exists

        res.status(201).json(newPersistedTrail);
    } catch(error) {
        console.log(error);
        res.status(500).json({"error": "An error occured"});
    }
}

export async function editTrail(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    if (!id) {
        res.status(400).json({"error": "Invalid ID"});
        return;
    }

    const trailToUpdate = await getTrailById(id);
    if (!trailToUpdate) {
        res.status(404).json({ "message": "Trail not found" });
    }

    const patch: TrailPatch = req.body;

    const allowedFields: (keyof TrailPatch)[] = [
        "title", "region_id", "difficulty", "distance_km", "description", "image_url"
    ];

    const entries = Object.entries(patch).filter(
    ([key, value]) =>
        allowedFields.includes(key as keyof TrailPatch) &&
        value !== undefined
    )

    if (entries.length === 0) {
        res.status(400).json({"error": "No valid fields"});
    }

    try {
        await patchTrail(id, entries);
    } catch(error) {
        console.log(error);
        res.status(500).json({ "message": "an error occured" });
    }

    const updatedTrail = await getTrailById(id);
    res.status(200).json(updatedTrail);
}

export async function removeTrail(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({"error": "Invalid ID"});
        return;
    }

    let trailToBeDeleted: Trail | undefined;

    try {
        trailToBeDeleted = await getTrailById(id);
    } catch(error) {
        console.log(error);
        res.status(500).json({"error": "An error occured"});
    }

    if (!trailToBeDeleted) {
        res.status(404).json({"error": "Trail not found"});
    }

    try {
        await deleteTrail(id);
        res.status(204);
    } catch(error) {
        console.log(error);
        res.status(500).json({"error": "An error occured"});
    }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}