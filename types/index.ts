export interface Note {
    title: string;
    url: string;
    tags?: string[];
}

export interface Section {
    [key: string]: Note[];
}

export interface Unit {
    [key: string]: Section | Note[]; // Allow flexibility but typically unit contains sections which contain notes
}

// Strict hierarchy: Semester -> Subject -> Unit -> Section -> Note[]
// However, the JSON structure provided in prompt: Year -> Sem -> Subject -> Unit -> Section (key) -> Note[]
// Example: "unit1": { "short-notes": [...] }

export type ContentMap = {
    [semester: string]: {
        [subject: string]: {
            [unit: string]: {
                [section: string]: Note[];
            };
        };
    };
};

export const SECTION_ORDER = [
    "notes",
    "slides",
    "question-banks",
    "short-notes",
    "assignments",
    "lab-manuals"
];
