export const file_types = ["iri", "friccion", "agrfatiga", "grlong", "grtrans"];

export interface GeneralData {
  join_segments: number;
  singular_points: number;
  percentile: number;
  moving_average: number;
  distance: number;
}

// TypeStructure for IRI
export interface IRI {
  id: string;
  measurements: number[];
  distance: number;
  iri: number[];
  error: string;
  average: number;
  max: number;
  min: number;
  total: number;
  [key: string]: any;
}

// Type struct for Slopes
export interface Slope {
  start: number;
  end: number;
  iri: number;
}

// In progress
// Type struct for process's results
export interface Result {
  media: number;
}
