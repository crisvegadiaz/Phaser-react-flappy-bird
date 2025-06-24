# 🎮 Flappy Bird con React & Phaser

¡Bienvenido! Este proyecto integra un divertido juego estilo Flappy Bird, desarrollado con **Phaser**, dentro de una moderna interfaz hecha en **React**. Aprovecha la velocidad de **Vite** y la navegación fluida de **React Router**.

---

## 🚀 Tecnologías Utilizadas

- **React**: Interfaces de usuario interactivas y reactivas.
- **Vite**: Entorno de desarrollo ultrarrápido.
- **Phaser**: Framework para juegos 2D en HTML5.
- **React Router**: Navegación entre páginas.
- **React Icons**: Iconografía moderna y personalizable.

---

## 🧩 Componentes Principales

### `Juego.jsx`

- **Gestión del Juego:** Aloja y controla la instancia de Phaser.
- **Inicialización:** Crea `Phaser.Game` usando la configuración de `config.js`.
- **Pausa/Reanudación:** Botón de menú (`<CgMenuGridR />`) para mostrar un `Modal` que pausa/reanuda la escena activa.
- **Estado Reactivo:** Usa `useState` y `useEffect` para manejar el juego y el modal.

### `Modal.jsx`

- **Menú de Configuración:** Accesible durante el juego.
- **Control de Volumen:** Ajusta el volumen del audio en tiempo real (`<input type="range" />`).
- **Navegación Segura:** Enlace (`<Link to="/" />`) para volver al inicio, destruyendo la instancia de Phaser para liberar recursos.
- **Interacción Directa:** Modifica propiedades del juego y variables globales de `config.js`.

### `src/scene/config.js` *(Inferido)*

- **Configuración Global:** Define el objeto `config` para `Phaser.Game` (tamaño, escenas, renderizado, etc.).
- **Variables Compartidas:** Exporta `variableContaste` con valores globales como el volumen de audio.

---

## 🔄 Flujo de Usuario

1. El usuario accede a la página del juego.
2. `Juego.jsx` inicializa Phaser y carga la escena.
3. El usuario puede pausar el juego abriendo el menú (Modal).
4. Dentro del Modal, ajusta el volumen y ve los cambios al instante.
5. Al regresar al inicio, el juego se destruye limpiamente antes de cambiar de ruta.

---

## ⚙️ ¿Cómo Ejecutar el Proyecto?

1. Instala las dependencias:
    ```bash
    npm install
    ```
2. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---
