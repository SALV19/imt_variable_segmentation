class Desplazamiento_2 extends Desplazamiento_1 {
  _desplazamiento_0 = parseFloat($("#l2_fhe").val());
  _desplazamiento_01 =
    parseFloat($("#l2_thickness").val()) + this._desplazamiento_0;
  _module = parseFloat($("#l2_module").val());
  _poisson = parseFloat($("#l2_poisson").val());

  #load = parseFloat($("#load").val());

  calculate_segments() {
    this._calculate_d1();
    for (let i = 1; i < 9; i++) {
      const geofono = parseFloat($(`#sensor_geofon_d${i + 1}`).val());
      const r1 = Math.sqrt(
        Math.pow(this._desplazamiento_0, 2) + Math.pow(geofono, 2),
      );
      const r2 = Math.sqrt(
        Math.pow(this._desplazamiento_01, 2) + Math.pow(geofono, 2),
      );

      const cos1 = this._desplazamiento_0 / r1;
      const cos2 = this._desplazamiento_01 / r2;

      const des_z_1 =
        (((1 + this._poisson) * this.#load) / 2 / Math.PI / r1 / this._module) *
        (2 * (1 - this._poisson) + Math.pow(cos1, 2)) *
        1000;
      const des_z_2 =
        (((1 + this._poisson) * this.#load) / 2 / Math.PI / r2 / this._module) *
        (2 * (1 - this._poisson) + Math.pow(cos2, 2)) *
        1000;

      this.sensors[i] = des_z_1 - des_z_2;
    }
  }
}
