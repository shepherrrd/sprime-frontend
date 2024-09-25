import jsonData from "result.json" assert { type: "json" };

export const metadata = Array.isArray(jsonData) ? jsonData : [jsonData];
