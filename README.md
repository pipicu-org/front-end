# PipiCucu Frontend

## Descripción

PipiCucu es una aplicación frontend desarrollada con Next.js para la gestión integral de pedidos en un restaurante. Permite manejar el flujo de órdenes desde la recepción, pasando por la cocina y hasta el delivery, facilitando la coordinación entre diferentes áreas del negocio.

La aplicación incluye funcionalidades como:
- Creación y gestión de pedidos
- Seguimiento de estados de órdenes (Creados, Pendientes, Preparados, En camino, Entregado, Cancelado)
- Interfaz para recepción, cocina y delivery
- Gestión de clientes y métodos de pago
- Visualización en tiempo real del estado de los pedidos

## Tecnologías Utilizadas

- **Next.js 15**: Framework de React para aplicaciones web
- **React 19**: Biblioteca para interfaces de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de estilos utilitarios
- **HeroUI**: Biblioteca de componentes UI
- **Framer Motion**: Animaciones y transiciones
- **Axios**: Cliente HTTP para llamadas a la API

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalados:

- **Node.js** versión 18 o superior
- **npm** o **yarn** (viene incluido con Node.js)
- Un backend API compatible (ver sección de configuración)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd pipi-cucu-front-end
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
   Ajusta la URL según la ubicación de tu backend API.

## Ejecución

### Entorno de Desarrollo

Para ejecutar el servidor de desarrollo con hot reload:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Construcción para Producción

Para construir la aplicación para producción:

```bash
npm run build
```

### Ejecución en Producción

Después de construir, puedes ejecutar la aplicación en modo producción:

```bash
npm start
```

### Linting

Para ejecutar el linter y verificar el código:

```bash
npm run lint
```

## Estructura del Proyecto

```
src/
├── app/                          # Directorio principal de la aplicación
│   ├── components/               # Componentes reutilizables
│   │   ├── cardKanban/          # Componente para tarjetas Kanban
│   │   ├── cards/               # Componentes de tarjetas
│   │   ├── clientLayout/        # Layout del cliente
│   │   ├── iconButton/          # Botones con iconos
│   │   ├── input/               # Componentes de entrada
│   │   ├── navbar/              # Barra de navegación
│   │   ├── OrdenesAleatorias/   # Órdenes aleatorias
│   │   ├── OrderCard/           # Tarjetas de órdenes
│   │   └── ...                  # Otros componentes
│   ├── delivery/                # Página y componentes de delivery
│   ├── kitchen/                 # Página y componentes de cocina
│   │   ├── components/
│   │   │   ├── comanda/         # Componente de comanda
│   │   │   └── tablaDeFuegos/   # Tabla de fuegos
│   ├── reception/               # Página y componentes de recepción
│   │   ├── components/
│   │   │   ├── orden/           # Componentes relacionados con órdenes
│   │   │   │   ├── ordenDefault/
│   │   │   │   ├── ordenForm/
│   │   │   │   ├── ordenModal/
│   │   │   │   └── ordenVer/
│   │   │   ├── orderStateCard/  # Tarjetas de estado de órdenes
│   │   │   ├── orderStateColumn/# Columnas de estado
│   │   │   └── summary/         # Resumen de órdenes
│   ├── services/                # Servicios de API
│   │   ├── api.ts               # Configuración de Axios
│   │   └── clients.service.ts   # Servicio de clientes
│   ├── types/                   # Definiciones de tipos TypeScript
│   │   ├── clients.type.ts      # Tipos de clientes
│   │   └── orders.type.ts       # Tipos de órdenes
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout raíz
│   └── page.tsx                 # Página principal
public/                          # Archivos estáticos
├── icons/                       # Iconos SVG
├── Poppins/                     # Fuentes Poppins
└── ...                          # Otros archivos estáticos
```

### Descripción de Directorios Principales

- **`src/app/`**: Contiene la lógica principal de la aplicación usando el App Router de Next.js
- **`components/`**: Componentes reutilizables organizados por funcionalidad
- **`services/`**: Lógica para interactuar con APIs externas
- **`types/`**: Definiciones de tipos TypeScript para mantener consistencia
- **`public/`**: Archivos estáticos como imágenes, fuentes e iconos

## API Backend

Esta aplicación frontend requiere un backend API para funcionar completamente. La configuración predeterminada apunta a `http://localhost:3001/api`, pero puedes ajustarla en las variables de entorno.

El backend debe proporcionar endpoints para:
- Gestión de órdenes (CRUD)
- Gestión de clientes
- Estados de pedidos
- Autenticación (si aplica)

## Contribución

¡Las contribuciones son bienvenidas! Para contribuir al proyecto:

1. **Fork** el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios siguiendo las mejores prácticas
4. Ejecuta los tests y linting: `npm run lint`
5. Confirma tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
6. Push a la rama: `git push origin feature/nueva-funcionalidad`
7. Abre un **Pull Request**

### Estándares de Código

- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de nomenclatura de React y Next.js
- Mantén la consistencia con el estilo existente
- Usa ESLint para verificar el código
- Documenta componentes y funciones complejas

### Reporte de Issues

Si encuentras bugs o tienes sugerencias, por favor abre un issue en el repositorio con:
- Descripción clara del problema
- Pasos para reproducirlo
- Información del entorno (versión de Node.js, navegador, etc.)
- Capturas de pantalla si aplica

## Despliegue

La aplicación puede desplegarse en cualquier plataforma que soporte Next.js, como:
- Vercel (recomendado)
- Netlify
- AWS Amplify
- Docker

Para Vercel, simplemente conecta tu repositorio y configura las variables de entorno.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

## Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo o abre un issue en el repositorio.
