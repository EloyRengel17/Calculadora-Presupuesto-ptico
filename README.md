> **English:** Web tool that calculates the optical power budget of GPON links and helps locate network faults. Built during my internship at Inter (NestJS, React, PostgreSQL).
# Sistema de Localización de Averías - Proyecto de Pasantías (Inter)

Este repositorio contiene el "Desarrollo de un prototipo de aplicación web y móvil para la localización de averías en planta externa e interna mediante el análisis de presupuesto de potencia óptica en la Corporación Telemic C.A. (Inter), Cumaná". 

El proyecto está estructurado en un monorepositorio con el cliente (Frontend) y la API (Backend) separados en sus respectivas carpetas[cite: 4].

##  Tecnologías Utilizadas

*   **Frontend:** React (TypeScript / JavaScript)
*   **Backend:** NestJS
*   **Base de Datos:** PostgreSQL (Ejecución local, sin Docker)

##  Estructura del Repositorio

*   `/frontend`[cite: 4]: Contiene la interfaz de usuario, dashboards y vistas de la calculadora de presupuesto óptico.
*   `/backend`[cite: 4]: Contiene la API REST, controladores, servicios y la conexión a la base de datos mediante TypeORM.

## Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado en tu máquina local:

1.  [Node.js](https://nodejs.org/) (Versión 16+ recomendada).
2.  [PostgreSQL](https://www.postgresql.org/) (Instalado y ejecutándose como servicio local en tu sistema operativo, asegúrate de que el puerto 5432 esté activo).
3.  [Git](https://git-scm.com/) para clonar el repositorio.

##  Configuración e Instalación

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-pasantias
