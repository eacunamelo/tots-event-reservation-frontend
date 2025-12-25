# Frontend — App de Reserva de Espacios (Angular)

Aplicación web desarrollada en **Angular** para explorar espacios (salas), autenticarse y gestionar **reservas** consumiendo una **API REST** externa.

> Este repositorio corresponde **exclusivamente al FRONTEND**.  
> El backend se encuentra en **otro repositorio**.

---

## ✅ Funcionalidades

- Registro e inicio de sesión
- Listado de espacios
- Detalle de espacio
- Creación / edición / eliminación de reservas
- Validaciones en formularios (cliente)
- Notificaciones al usuario (éxito / error)

---

## 🧰 Tecnologías

- Angular (Standalone Components)
- TypeScript
- Angular Router
- Reactive Forms
- HttpClient
- RxJS
- CSS (estilos por componente + global)

---

## 🗂️ Estructura (resumen)

```
src/
  app/
    auth/
    spaces/
    reservations/
    core/
    shared/
  environments/
  main.ts
  styles.css
```

---

## ▶️ Cómo ejecutar (local)

### Requisitos
- Node.js 18+
- Angular CLI

### Instalar dependencias
```bash
npm install
```

### Levantar en desarrollo
```bash
ng serve
```

Abrir:
- `http://localhost:4200`

---

## 🔧 Configuración de API

El endpoint base se configura en:
- `src/environments/environment.ts`

Ejemplo:
```ts
export const environment = {
  apiUrl: 'http://localhost:8000/api/'
};
```

---

## 🎯 Puntos del feedback abordados / por abordar

**Ya cubierto:**
- Readme incluido y con pasos claros
- Proyecto organizado por features
- Formularios con validaciones base y notificaciones

**Mejoras planificadas (frontend):**
- Mejorar UX de loading (spinner/skeleton) en listados, detalle y submit
- Confirmación al eliminar (modal)
- Mejor manejo de errores de formulario (marcar campos, mensajes claros)
- Refactor de servicios/métodos largos
- Modernización de RxJS (evitar `subscribe` anidados, usar `pipe`, `catchError`, `finalize`, etc.)
- Lazy Loading por rutas (opcional, suma)

> Nota: **SCSS no se usará** en esta versión (no es obligatorio para el desafío).

---

### MC-Table (MC Kit)

Se intentó integrar MC-Table desde el repositorio oficial de MC Kit
(https://github.com/matiascamiletti/mc-kit), tal como se indica en el requerimiento.

Durante la integración se detectó que MC Kit no se encuentra publicado como librería
distribuible y presenta dependencias internas
(por ejemplo `@mckit/core`), lo que impide su consumo directo en una aplicación Angular externa.

Por este motivo, el listado fue implementado mediante una estructura desacoplada,
basada en Observables y templates, de forma que la integración de MC-Table
sea inmediata en un entorno donde la librería se encuentre correctamente distribuida.


## 🧪 Testing

Se implementaron tests unitarios utilizando **Vitest**.

- Se testea la lógica de negocio de componentes standalone
- Los servicios son mockeados con `vi.fn()`
- No se renderizan templates para evitar dependencias del Angular compiler
- Tests enfocados en comportamiento, estado y flujo de datos
- Ejecución rápida y desacoplada del DOM

### Ejecutar tests
```bash
npx vitest

## 👤 Autor  
Prueba técnica — Frontend Angular
