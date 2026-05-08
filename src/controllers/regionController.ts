
import { getRegions, getRegionBySlug } from "../models/regionModel";
import { getTrailsByRegion } from "../models/trailModel";
import type { Request, Response } from "express";

export async function listRegions(_req: Request, res: Response): Promise<void> {
    try {
        const regions = await getRegions();
        res.render("regions", { regions })
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }
}

export async function showRegion(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const slug = Array.isArray(req.params.slug)
        ? req.params.slug[0]
        : req.params.slug;

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        res.status(400).send("Invalid slug");
        return;
    }

    let region = undefined;
    try {
        region = await getRegionBySlug(slug);
    } catch(error) {
        console.log(error);
        res.status(500).send("An error occured");
    }

    if (!region) {
        return;
    }

    const regionTrails = await getTrailsByRegion(region.id);

    res.render("region", {
        region: {
            ...region, 
            trails: regionTrails
        },
    });
}
