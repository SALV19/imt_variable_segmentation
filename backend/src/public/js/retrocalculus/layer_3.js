class Desplazamiento_3 extends Desplazamiento_1 {
  _module = parseFloat($("#l3_module").val());
  _poisson = parseFloat($("#l3_poisson").val());

  #n = parseFloat($("#l3_n").val());
  #fhe = parseFloat($("#l3_fhe").val());
  #atm_pressure = parseFloat($("#atm_pressure").val());

  #calculate_d1() {
    const o1 =
      (this._pressure *
        (1 -
          1 /
            Math.pow(
              Math.sqrt(1 + Math.pow(this._radius / this.#fhe, 2)),
              3,
            ))) /
      1000;

    const Eoz =
      (1 - 2 * this.#n) *
      this._module *
      Math.pow(o1 / this.#atm_pressure, this.#n);

    const result =
      (((1 + this._poisson) * this._pressure * this._radius) / Eoz) *
      (1 / Math.sqrt(1 + Math.pow(this.#fhe / this._radius, 2)) +
        (1 - 2 * this._poisson) *
          (Math.sqrt(1 + Math.pow(this.#fhe / this._radius, 2)) -
            this.#fhe / this._radius));

    this.sensors[0] = result;
  }

  calculate_segments() {
    this.#calculate_d1();
    for (let i = 1; i < 9; i++) {
      const geofono = parseFloat($(`#sensor_geofon_d${i + 1}`).val());
      const sqrtGeofonoFhe = Math.sqrt(
        Math.pow(geofono, 2) + Math.pow(this.#fhe, 2),
      );

      const r1 =
        geofono > this.#fhe
          ? Math.sqrt(Math.pow(geofono, 2) * 2)
          : sqrtGeofonoFhe;

      const r2 = sqrtGeofonoFhe;

      const cos1 =
        geofono > this.#fhe
          ? Math.cos(Math.PI / 4)
          : this.#fhe / sqrtGeofonoFhe;

      const cos2 = this.#fhe / sqrtGeofonoFhe;

      const o1 = ((3 * this._load) / (2 * Math.PI * Math.pow(r1, 2))) * cos1;
      const Eoz =
        (1 - 2 * this.#n) *
        this._module *
        Math.pow(o1 / this.#atm_pressure, this.#n);

      this.sensors[i] =
        (((1 + this._poisson) * this._load) / (2 * Math.PI * r2 * Eoz)) *
        (2 * (1 - this._poisson) + Math.pow(cos2, 2)) *
        1000;
    }
  }
}
