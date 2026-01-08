export function objectFilter(object: Record<string, Object>, condition: (val: string) => boolean) {
  return Object.keys(object).reduce((acum: Record<string, Object>, curr) => {    
    if (condition(curr))
      return acum
    acum[curr] = object[curr];
    return acum;
  }, {})
}