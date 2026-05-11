import { getRegions } from "../models/regionModel";
import type { Request, Response } from "express";

export async function fetchRegions(_req: Request, res: Response): Promise<void> {
    const regions = await getRegions();
    res.json(regions);
}