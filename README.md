# imt_variable_segmentation

El proyecto está desarrollado usando Express para el backend con la arquitectura MVC.
Mientras que el frontend está desarrollado con EJS, utilizando 'atomic design' para manejar la interface por componentes modulares.

## Arquitectura

### MVC

## Iniciar el servidor:

```bash
# Para preparar el ambiente de desarrollo
git clone {URL del repositorio}
cd backend/src/python

python -m venv venv
pip install -r requirements.txt

# Para correr el prooyecto
cd backend

# Desarrollo
npm run dev

# Producción
pm2 start
```

## Archivos:

- home.controller.js: Entrada del proyecto, carga la primera interface al igual que recibe la entrada de los datos, archivo de excel para la segmentación y genera la segmentación homogenea de los componentes enviados.
  Para esto se apoya de varias funciones en src/component.

- chart.controller.js: Se encarga de generar el archivo de excel mandando a llamar a un script de python - 'generate_excel.py'

- download_example.controller.js: Descarga un archivo ya con el formato adecuado para que el usuario solo suba la información que quiere analizar.

- generate_excel.py: Es el archivo principal que lee la entrada de datos y manda a llamar los diferentes métodos para generar cada hoja del excel, finaliza enviando de vuelta la respuesta del archivo generado
