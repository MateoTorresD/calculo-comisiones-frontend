# comisiones-web

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

Front de **Gestión de Comisiones**: el usuario elige un rango de fechas, presiona _Calcular comisión_ y ve una tabla con el total vendido, el porcentaje y la comisión de cada vendedor.

## Backend

Consume `GET /commissions` del repositorio [comisiones-api](https://github.com/MateoTorresD/calculo-comisiones-api).

## Variables de entorno

| Variable       | Descripción                                                         | Ejemplo                               |
| -------------- | ------------------------------------------------------------------- | ------------------------------------- |
| `VITE_API_URL` | URL del backend, sin slash final. Se incrusta en el build (Vercel). | `https://comisiones-api.onrender.com` |

## Ejecutar

```bash
npm install
npm run dev
```
