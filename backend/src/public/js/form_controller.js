const ids = [
  "iri",
  "friccion",
  "deflexiones",
  "agretamiento_por_fatiga",
  "agrietamiento_longitudinal",
  "agrietamiento_transversal",
  "profundidad_rodera",
];

let count = 0;

function changeDirection(direction) {
  if (direction == "right") {
    count += 1;
  } else {
    count -= 1;
  }

  const length = ids.length;
  changeForm(ids[(length + (count % length)) % length]);
}
