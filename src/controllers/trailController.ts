import { getTrails, getTrailBySlug } from "../models/trailModel";
import type { Request, Response } from "express";

export async function listTrails(_req: Request, res: Response): Promise<void> {
    try {
        const trails = await getTrails();
        const viewTrails = trails.map((trail) => ({
            ...trail,
            createdAt: formatDate(trail.created_at),
            difficultyColor: setBadgeColor(trail.difficulty)
        }));
        res.render("index", { trails: viewTrails })
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }
}

export async function showTrail(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).send("Invalid slug");
      return;
    }

    let trail = undefined;
    try {
        trail = await getTrailBySlug(slug);
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }

    if (!trail) {
        return;
    }

    res.render("trail", {
        trail: {
            ...trail, 
            createdAt: formatDate(trail.created_at) 
        },
    });
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