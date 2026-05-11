import type { Trail } from "../models/trailModel";
import { getTrails, getTrailById, addTrail, updateTrail, deleteTrail } from "../models/trailModel";
import { getRegions } from "../models/regionModel";
import type { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

export async function listTrails(_req: Request, res: Response): Promise<void> {
    try {
        const trails = await getTrails();
        const viewTrails = trails.map((trail) => ({
            ...trail,
            createdAt: formatDate(trail.created_at),
            difficultyColor: setBadgeColor(trail.difficulty)
        }));
        res.render("admin/index", { trails: viewTrails })
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }
}

export async function newTrail(_req: Request, res: Response): Promise<void> {
    const regions = await(getRegions());
    res.render("admin/trailForm", { regions: regions });
}

export async function saveNewTrail(req: Request, res: Response): Promise<void> {
    const newTrailTitle = sanitizeHtml(req.body.trailTitle);
    const newTrailSlug = slugify(newTrailTitle);
    const newTrailRegion = Number(req.body.trailRegion);
    const newTrailDifficulty = req.body.trailDifficulty; // todo: check for valid options
    const newTrailDistance = Number(sanitizeHtml(req.body.trailDistance));
    const newTrailImage = sanitizeHtml(req.body.trailImage);
    const newTrailDescription = sanitizeHtml(req.body.trailDescription);

    const newTrail: Omit<Trail, "id"> = {
        title: newTrailTitle,
        slug: newTrailSlug,
        region_id: newTrailRegion,
        difficulty: newTrailDifficulty,
        distance_km: newTrailDistance,
        description: newTrailDescription,
        image_url: newTrailImage, 
        created_at: Math.floor(Date.now() / 1000)
    }

    try {
        await addTrail(newTrail);
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }
    
    res.redirect("/admin");
}

export async function editTrail(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).send("Invalid ID");
      return;
    }

    const trail = await getTrailById(id);
    if(!trail) {
      res.status(404).send("Trail not found");
      return;
    }

    try {
        const regions = await(getRegions());

        res.render("admin/trailForm", {
        trail: trail,
        regions: regions
        });
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }
}

export async function saveUpdatedTrail(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).send("Invalid ID");
      return;
    }

    const updatedTrailTitle = sanitizeHtml(req.body.trailTitle);
    const updatedTrailSlug = slugify(updatedTrailTitle);
    const updatedTrailRegion = Number(req.body.trailRegion);
    const updatedTrailDifficulty = req.body.trailDifficulty; // todo: set fixed value
    const updatedTrailDistance = Number(sanitizeHtml(req.body.trailDistance));
    const updatedTrailImage = sanitizeHtml(req.body.trailImage);
    const updatedTrailDescription = sanitizeHtml(req.body.trailDescription);

    try {
        await updateTrail(id, updatedTrailTitle, updatedTrailSlug, updatedTrailRegion, updatedTrailDifficulty, updatedTrailDistance, updatedTrailImage, updatedTrailDescription);
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }
    res.redirect("/admin")
}

export async function removeTrail(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).send("Invalid ID");
      return;
    }

    try {
        await deleteTrail(id);
    } catch(error) {
        res.redirect("/admin");
    }
}

function formatDate(timestamp: number): string {
    const readableDate = new Date(timestamp * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return readableDate;
}

function setBadgeColor(difficulty: string): string {
    if (difficulty === "easy") {
        return "green";
    }
    if (difficulty === "moderate") {
        return "orange";
    }
    return "red";
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}