import fs from 'fs';
import path from 'path';
import { ContentMap } from '@/types';

const contentPath = path.join(process.cwd(), 'data', 'content.json');

export function getContent(): ContentMap {
    const fileContents = fs.readFileSync(contentPath, 'utf8');
    return JSON.parse(fileContents);
}

// Helper to get all years
export function getYears() {
    const content = getContent();
    return Object.keys(content);
}
