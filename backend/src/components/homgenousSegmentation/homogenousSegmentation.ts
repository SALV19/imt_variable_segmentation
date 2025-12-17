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
  const [events, boundaries] = getBoundaries(dynamicSlopes, staticSlopes);
  const points = Array.from(boundaries.keys()).sort((a, b) => a - b);

  const currentValues: Record<string, number> = {};
  const matrix: MatrixRow[] = [];

  let cursor = points[0];

  for (let i = 0; i < points.length - 1; i++) {
    const boundary = points[i];
    const next = points[i + 1];

    // Apply updates at boundary
    const updates = events.get(boundary);
    if (updates) {
      for (const u of updates) {
        currentValues[u.param] = u.value;
      }
    }

    const boundaryKinds = boundaries.get(next)!;
    const isStaticSplit = boundaryKinds.has("static");

    const length = next - cursor;

    if (!isStaticSplit && length < minimumSegment) {
      continue;
    }

    matrix.push({
      start: cursor,
      end: next,
      parameters: { ...currentValues },
    });

    cursor = next;
  }

  return matrix;
}

function getBoundaries(
  dynamicSlopes: SerializedSegmentation[],
  staticSlopes: SerializedSegmentation[]
): [Map<number, SerializedSegmentation[]>, Map<number, Set<BoundaryKind>>] {
  const events = new Map<number, SerializedSegmentation[]>();
  const boundaries = new Map<number, Set<BoundaryKind>>();

  function addBoundary(point: number, kind: BoundaryKind) {
    if (!boundaries.has(point)) {
      boundaries.set(point, new Set());
    }
    boundaries.get(point)!.add(kind);
  }

  for (const s of dynamicSlopes) {
    addBoundary(s.start, "dynamic");
    addBoundary(s.end, "dynamic");
    (events.get(s.start) ?? events.set(s.start, []).get(s.start)!).push(s);
  }

  for (const s of staticSlopes) {
    addBoundary(s.start, "static");
    addBoundary(s.end, "static");
    (events.get(s.start) ?? events.set(s.start, []).get(s.start)!).push(s);
  }

  return [events, boundaries];
}
