export default function parseFileName(parameters: Object[]) {
  const pair_titles: Record<string, string> = {
    agretamiento_por_fatiga: "agrfatiga",
    agrietamiento_longitudinal: "grlong",
    agrietamiento_transversal: "grtrans",
    profundidad_rodera: "pr",
    static_transito: "tdpa",
    baches: "baches",
    desprendimientos: "desprendimientos",
    macrotextura: "macrotextura",
    static_tipo_pavimento: "tipo de pavimento",
    area_agrietamiento: "area agrietamiento"
  };

  return Object.keys(parameters).reduce(
    (acum, key) => ({
      ...acum,
      // @ts-ignore
      [pair_titles[key] ?? key]: parameters[key],
    }),
    {}
  );
}