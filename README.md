# Frontend — App de Reserva de Espacios (Angular)

Aplicación web desarrollada en **Angular** para la exploración de espacios (salas), autenticación de usuarios y gestión de **reservas**, consumiendo una **API REST externa**.

> 📌 Este repositorio corresponde **exclusivamente al FRONTEND**.  
> El backend se encuentra en un **repositorio independiente**.

---

## 🧭 Descripción general

La aplicación permite a los usuarios:

- Autenticarse en el sistema
- Visualizar espacios disponibles
- Crear, editar y cancelar reservas
- Recibir feedback visual ante acciones exitosas o errores

El proyecto fue desarrollado utilizando **Angular moderno (Standalone Components)**, con una arquitectura organizada por **features**, priorizando claridad, mantenibilidad y buenas prácticas.

---

## ✅ Funcionalidades

- Registro e inicio de sesión
- Listado de espacios
- Detalle de espacio
- Creación, edición y eliminación de reservas
- Validaciones de formularios del lado cliente
- Notificaciones al usuario (éxito / error)
- Estados de carga con **Skeleton Loaders**
- Modal de confirmación al eliminar reservas

---

## 🧰 Tecnologías utilizadas

- Angular (Standalone Components)
- TypeScript
- Angular Router
- Reactive Forms
- HttpClient
- RxJS
- CSS (estilos globales y por componente)
- Vitest (testing unitario)

---

## 🗂️ Estructura del proyecto

```
src/
 ├─ app/
 │   ├─ auth/
 │   ├─ spaces/
 │   ├─ reservations/
 │   ├─ core/
 │   └─ shared/
 ├─ environments/
 ├─ main.ts
 └─ styles.css
```

---

## ▶️ Ejecución en entorno local

### Requisitos
- Node.js 18+
- Angular CLI

### Instalación de dependencias
```bash
npm install
```

### Ejecutar en desarrollo
```bash
ng serve
```

Abrir en el navegador:
```
http://localhost:4200
```

---

## 🔧 Configuración de la API

El endpoint base del backend se configura en:

```
src/environments/environment.ts
```

Ejemplo:
```ts
export const environment = {
  apiUrl: 'http://localhost:8000/api/'
};
```

---

## 🧠 Decisiones técnicas relevantes

### RxJS
- Uso de `pipe`, `catchError`, `finalize` y `forkJoin`
- Evita `subscribe` anidados
- Separación clara entre lógica y presentación
- Flujos de datos predecibles

### UX y Loading
- Implementación de **Skeleton Loaders**
- Mejora en percepción de rendimiento
- Corrección de estados de carga bloqueados
- Eliminación de errores de ciclo de vida (NG0100)

### Formularios
- Formularios reactivos
- Validaciones visibles
- Mensajes claros sin depender de consola

### Eliminación de reservas
- Modal de confirmación
- Prevención de acciones accidentales
- Feedback inmediato al usuario

---

## 🧪 Testing

Se implementaron tests unitarios con **Vitest**.

### Enfoque
- Tests de lógica de negocio
- Servicios mockeados con `vi.fn()`
- Sin renderizar templates
- Ejecución rápida y desacoplada del DOM

### Ejecutar tests
```bash
npx vitest
```

---

## 📋 Nota sobre MC-Table (MC Kit)

Se intentó integrar **MC-Table** desde:
https://github.com/matiascamiletti/mc-kit

Durante la integración se detectó que:
- No está publicado como paquete npm distribuible
- Posee dependencias internas no exportadas (`@mckit/core`)

Esto impide su uso directo desde una app Angular externa.

### Decisión tomada
El listado fue implementado con una estructura desacoplada basada en Observables y templates,
dejando la lógica preparada para una futura integración directa.

---

## 📊 Feedback previo — estado actual

### Corregido
- README completo
- Eliminación de archivos y componentes vacíos
- Corrección de errores en consola
- Mejor UX de loading
- Modal de confirmación al eliminar
- Validaciones visibles
- Refactor de RxJS
- Tests unitarios implementados

### Opcional / no requerido
- SSR
- Lazy Loading por rutas
- Uso de SCSS

---

## 🆕 Funcionalidades agregadas

### 📅 Calendario de disponibilidad
- Vista mensual del espacio seleccionado
- Días disponibles y ocupados diferenciados visualmente
- Navegación entre meses
- Permite seleccionar cualquier día, incluso con reservas parciales
- Tooltip informativo en los días para indicar la acción (*“Mostrar agenda”*)

### 🕒 Agenda diaria por horas
- Se despliega al seleccionar un día del calendario
- Muestra bloques horarios del día completo
- Estados claros por franja:
  - Disponible
  - Ocupado (solo en rangos realmente reservados)
- Soporta reservas parciales dentro de un mismo día

## 🖼️ Screenshots
- Se agregó una carpeta `/screenshots` dentro del proyecto
- Incluye capturas de:
  - Calendario mensual
  - Agenda diaria por horas
  - Formulario de reserva
  - Estados de disponibilidad (ocupado / disponible)

## 👤 Autor

Prueba técnica — Frontend Angular
