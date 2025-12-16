import { MatrixRow, SerializedSegmentation, Slope } from "../../types/types.ts";

export function homogenousSegmentation(
  generatedData: any,
  staticData: any,
  minimumSegment: number
) {
  const dynamicSlopes: Record<string, Slope[]>[] = generatedData.map(
    (value: any) => {
      const key = Object.keys(value)[0];
      return { [key]: value[key].generated_data.slopes };
    }
  );

  const staticSlopes: Record<string, Slope[]>[] = staticData.map(
    (value: any) => {
      const key = Object.keys(value)[0];
      return { [key]: value[key].slopes };
    }
  );

  const orderedDynamicSlopes =
    serializeSlopes(dynamicSlopes).sort(sortFunction);
  const orderedStaticSlopes = serializeSlopes(staticSlopes).sort(sortFunction);

  const matrix = buildMatrix(
    orderedDynamicSlopes,
    orderedStaticSlopes,
    minimumSegment
  );

  return matrix;
}

function sortFunction(
  first: SerializedSegmentation,
  second: SerializedSegmentation
) {
  if (first.start >= second.start) return 1;
  else return -1;
}

function serializeSlopes(
  slopes: Record<string, Slope[]>[]
): SerializedSegmentation[] {
  const dynamicSlopes: SerializedSegmentation[] = [];
  slopes.forEach((value) => {
    const parameter = Object.keys(value)[0];
    Object.values(value)[0].forEach((data) => {
      dynamicSlopes.push({
        param: parameter,
        start: data.start,
        end: data.end,
        value: data.value,
      });
    });
  });

  return dynamicSlopes;
}

type BoundaryKind = "static" | "dynamic";

function buildMatrix(
  dynamicSlopes: SerializedSegmentation[],
  staticSlopes: SerializedSegmentation[],
  minimumSegment: number
): MatrixRow[] {
  const events = new Map<number, SerializedSegmentation[]>();
  const boundaries = new Map<number, Set<BoundaryKind>>();

  function addBoundary(point: number, kind: BoundaryKind) {
    if (!boundaries.has(point)) {
      boundaries.set(point, new Set());
    }
    boundaries.get(point)!.add(kind);
  }

  // Dynamic boundaries
  for (const s of dynamicSlopes) {
    addBoundary(s.start, "dynamic");
    addBoundary(s.end, "dynamic");

    if (!events.has(s.start)) events.set(s.start, []);
    events.get(s.start)!.push(s);
  }

  // Static boundaries
  for (const s of staticSlopes) {
    addBoundary(s.start, "static");
    addBoundary(s.end, "static");

    if (!events.has(s.start)) events.set(s.start, []);
    events.get(s.start)!.push(s);
  }

  const points = Array.from(boundaries.keys()).sort((a, b) => a - b);

  const currentValues: Record<string, number> = {};
  const matrix: MatrixRow[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const length = end - start;

    const boundaryKinds = boundaries.get(start)!;
    const isStaticSplit = boundaryKinds.has("static");

    // Apply all changes at this point
    const updates = events.get(start);
    if (updates) {
      for (const u of updates) {
        currentValues[u.param] = u.value;
      }
    }

    if (!isStaticSplit && length < minimumSegment) continue;

    // Create interval snapshot
    matrix.push({
      start: start,
      end: end,
      parameters: { ...currentValues },
    });
  }

  return matrix;
}
