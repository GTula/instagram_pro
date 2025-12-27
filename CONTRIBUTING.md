# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Instagram Pro! Este documento te guiará a través del proceso.

## 🌟 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. **Verifica** que no exista ya un issue similar
2. **Abre un nuevo issue** con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla (si aplica)
   - Versión del navegador y sistema operativo

### Sugerir Mejoras

Para nuevas funcionalidades o mejoras:

1. **Abre un issue** describiendo:
   - El problema que resuelve
   - Cómo lo implementarías
   - Beneficios para los usuarios
2. **Espera feedback** antes de empezar a programar

### Pull Requests

1. **Fork** el repositorio
2. **Crea una rama** con un nombre descriptivo:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
   o
   ```bash
   git checkout -b fix/correccion-bug
   ```

3. **Realiza tus cambios** siguiendo las guías de estilo

4. **Prueba** tus cambios extensivamente:
   - Carga la extensión en modo desarrollador
   - Verifica que todo funcione en Instagram
   - Asegúrate de no romper funcionalidad existente

5. **Commit** con mensajes claros:
   ```bash
   git commit -m "Add: Nueva funcionalidad de filtros"
   git commit -m "Fix: Corrección de detección de botones"
   ```

6. **Push** a tu fork:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

7. **Abre un Pull Request** con:
   - Descripción clara de los cambios
   - Referencias a issues relacionados
   - Capturas de pantalla de cambios visuales
   - Notas sobre testing realizado

## 📋 Guías de Estilo

### JavaScript

- Usa nombres de variables descriptivos en inglés o español consistente
- Comenta código complejo
- Evita funciones muy largas
- Usa `async/await` en lugar de callbacks cuando sea posible
- Mantén la consistencia con el código existente

```javascript
// ✅ Bien
async function followUsers(limit, delay) {
  // Implementation
}

// ❌ Evitar
function fu(l, d) {
  // Implementation
}
```

### HTML/CSS

- Mantén la estructura semántica
- Usa clases descriptivas
- Sigue el sistema de diseño existente
- Asegura que sea responsive

### Commits

Formato recomendado:
```
Tipo: Descripción breve

Descripción más detallada si es necesario

Fixes #123
```

Tipos:
- `Add`: Nueva funcionalidad
- `Fix`: Corrección de bug
- `Update`: Actualización de funcionalidad existente
- `Refactor`: Refactorización de código
- `Docs`: Cambios en documentación
- `Style`: Cambios de formato/estilo
- `Test`: Añadir o modificar tests

## 🧪 Testing

Antes de hacer un PR, asegúrate de probar:

1. **Instalación**: La extensión se instala correctamente
2. **Follow**: La funcionalidad de follow funciona en:
   - Listas de seguidores
   - Resultados de búsqueda
   - Páginas de explorar
3. **Unfollow**: La funcionalidad de unfollow funciona
4. **Velocidades**: Todas las velocidades respetan los tiempos
5. **Límites**: Los límites se respetan correctamente
6. **Stop**: El botón de detener funciona
7. **UI**: La interfaz se ve correcta
8. **Errores**: Los mensajes de error son claros

## 🐛 Debugging

Para debuggear la extensión:

1. **Console de la extensión**:
   - `chrome://extensions/`
   - Busca "Instagram Pro"
   - Click en "inspeccionar ventana emergente"

2. **Console del content script**:
   - F12 en la página de Instagram
   - Busca logs en la consola

3. **Mensajes**:
   - Verifica los mensajes entre popup y content script
   - Usa `console.log` para seguir el flujo

## 🔒 Seguridad

- **NO** incluyas credenciales en el código
- **NO** agregues llamadas a APIs externas sin discutir primero
- **NO** recopiles datos del usuario
- Reporta vulnerabilidades de seguridad privadamente

## 📝 Documentación

Si agregas nuevas funcionalidades:

1. Actualiza el README.md
2. Actualiza INSTALLATION.md si afecta instalación
3. Agrega comentarios en el código
4. Documenta nuevas configuraciones

## 🌐 Internacionalización

Actualmente la extensión está en español. Si quieres agregar otros idiomas:

1. Mantén el español como predeterminado
2. Usa un sistema de traducción consistente
3. Documenta cómo agregar nuevos idiomas

## ✅ Checklist para PRs

Antes de enviar tu PR, verifica:

- [ ] El código sigue las guías de estilo
- [ ] Has probado todos los casos de uso
- [ ] No rompe funcionalidad existente
- [ ] La extensión se instala correctamente
- [ ] Actualizaste la documentación relevante
- [ ] Los commits tienen mensajes descriptivos
- [ ] El PR tiene una descripción clara
- [ ] No incluye archivos innecesarios (.DS_Store, node_modules, etc.)

## 💡 Ideas para Contribuir

Si buscas ideas de qué implementar:

- Mejoras en la detección de botones
- Soporte para más idiomas
- Filtros avanzados (por número de seguidores, verificados, etc.)
- Estadísticas más detalladas
- Exportar lista de usuarios procesados
- Modo "Smart" que ajusta velocidad según respuesta de Instagram
- Pausar y reanudar operaciones
- Lista negra de usuarios a no procesar
- Interfaz para revisar usuarios antes de procesar

## 📞 Contacto

Si tienes preguntas:
- Abre un issue de discusión
- Comenta en PRs existentes relacionados

## 🙏 Agradecimientos

¡Gracias por hacer Instagram Pro mejor para todos!

---

**Recuerda**: Todas las contribuciones deben respetar el [Código de Conducta](CODE_OF_CONDUCT.md) y la licencia MIT del proyecto.
