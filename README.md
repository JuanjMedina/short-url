*# Proyecto ShortUrl

Este es el **Proyecto ShortUrl**, una aplicación web desarrollada con **Node.js**, **NestJS**, **MongoDB** y **JsonWebToken**. La aplicación permite a los usuarios acortar y personalizar URLs, además de crear enlaces únicos para usuarios registrados.

A continuación, se detallan las instrucciones para configurar y ejecutar el proyecto tanto en entornos de desarrollo como en producción.

## Requisitos

- **Node.js** (versión mínima recomendada: v20.0.2)
- **pnpm** (versión mínima recomendada: v9.9.0)

## Instalación

1. Clona el repositorio:

   ```bash
    git clone https://github.com/usuario/repo.git
    cd repo
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

## Archivos de configuración

Antes de ejecutar la aplicación, es necesario crear dos archivos de configuración para manejar las variables de entorno:

- **`development.env`**: para el entorno de desarrollo.
- **`production.env`**: para el entorno de producción.

Ambos archivos deben contener las siguientes variables:

````bash
MONGODB_URI=<URL de la base de datos MongoDB>
PORT=<Puerto en el que se ejecutará la aplicación>
# Proyecto ShortUrl

Este es el **Proyecto ShortUrl**, una aplicación web desarrollada con **Node.js**, **NestJS**, **MongoDB** y **JsonWebToken**. La aplicación permite a los usuarios acortar y personalizar URLs, además de crear enlaces únicos para usuarios registrados.

A continuación, se detallan las instrucciones para configurar y ejecutar el proyecto tanto en entornos de desarrollo como en producción.

## Requisitos

- **Node.js** (versión mínima recomendada: v20.0.2)
- **pnpm** (versión mínima recomendada: v9.9.0)

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/usuario/repo.git
    cd repo
    ```

2. Instala las dependencias:
    ```bash
    pnpm install
    ```

## Archivos de configuración

Antes de ejecutar la aplicación, es necesario crear dos archivos de configuración para manejar las variables de entorno:

- **`development.env`**: para el entorno de desarrollo.
- **`production.env`**: para el entorno de producción.

Ambos archivos deben contener las siguientes variables:

```bash
MONGODB_URI=<URL de la base de datos MongoDB>
PORT=<Puerto en el que se ejecutará la aplicación>
````
*