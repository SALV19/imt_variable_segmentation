// O(n)
export function cumsum(iri: number[]): number[] {
  const length = iri.length;
  const avg = iri.reduce((acum, curr) => curr + acum) / length;
  const zk: number[] = aux_cumsum(iri, length, avg);

  return zk;
}

// Algorithm implementation
// O(n)
function aux_cumsum(iri: number[], length: number, avg: number): number[] {
  let acum = 0;
  const zk = [];
  for (let i = 0; i < length; i++) {
    acum += iri[i];
    zk.push(acum - i * avg);
  }

  return zk;
}
