$("#test").on("click", () => prueba());

function prueba() {
  const d1 = new Desplazamiento_1();
  const d2 = new Desplazamiento_2();
  d1.calculate_segments();
  d2.calculate_segments();
  console.log(d1.sensors, d2.sensors);
}

class Desplazamiento_1 {
  _desplazamiento_0 = 0;
  _desplazamiento_01 = parseFloat($("#l1_thickness").val());

  _pressure = parseFloat($("#pressure").val());
  _poisson = parseFloat($("#l1_poisson").val());
  _module = parseFloat($("#l1_module").val());

  #load = parseFloat($("#load").val());
  #thickness = parseFloat($("#l1_thickness").val());

  sensors = new Array(9);

  _calculate_d1() {
    const segment_1 = this._segment_formula(this._desplazamiento_0);

    const segment_2 = this._segment_formula(this._desplazamiento_01);

    this.sensors[0] = segment_1 - segment_2;
    return sensors;
  }

  _segment_formula(d) {
    const radius = parseFloat($("#radius").val());
    const seg_1 = (1 + this._poisson) * this._pressure * radius;
    const seg_2 = 1 / Math.sqrt(1 + Math.pow(d / radius, 2));
    const seg_3 = 1 - 2 * this._poisson;
    const seg_4 = Math.sqrt(1 + Math.pow(d / radius, 2)) - d / radius;

    const result = (seg_1 / this._module) * (seg_2 + seg_3 * seg_4);

    return result;
  }

  calculate_segments() {
    this._calculate_d1();
    for (let i = 1; i < 9; i++) {
      const geofono = parseFloat($(`#sensor_geofon_d${i + 1}`).val());
      const r = Math.sqrt(Math.pow(this.#thickness, 2) + Math.pow(geofono, 2));

      const cos = this.#thickness / r;

      const des_z_1 =
        (((1 + this._poisson) * this.#load) /
          2 /
          Math.PI /
          geofono /
          this._module) *
        (2 * (1 - this._poisson)) *
        1000;
      const des_z_2 =
        (((1 + this._poisson) * this.#load) / 2 / Math.PI / r / this._module) *
        (2 * (1 - this._poisson) + Math.pow(cos, 2)) *
        1000;

      this.sensors[i] = des_z_1 - des_z_2;
    }
  }
}
