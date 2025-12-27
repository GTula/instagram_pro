# 📸 Instagram Pro - Follow/Unfollow Manager

Una extensión de Chrome/Edge para gestionar follows y unfollows masivos en Instagram con controles de seguridad integrados.

## ✨ Características

- 🎯 **Follow/Unfollow Masivo**: Automatiza el proceso de seguir o dejar de seguir usuarios
- ⚡ **Control de Velocidad**: Tres niveles de velocidad con tiempos de espera seguros
  - 🛡️ Segura: 15-25 seg/acción (Recomendada)
  - ⚖️ Moderada: 8-15 seg/acción (Riesgo medio)
  - ⚠️ Rápida: 3-8 seg/acción (Mayor riesgo)
- 📊 **Estadísticas en Tiempo Real**: Seguimiento de acciones completadas y fallidas
- 🔒 **Uso de Sesión Existente**: No requiere credenciales, usa tu sesión actual de Instagram
- 🎲 **Comportamiento Humano**: Retrasos aleatorios y movimientos simulados para evitar detección
- 📈 **Límites Configurables**: Establece el número máximo de acciones por sesión

## 🚀 Instalación

### Opción 1: Modo Desarrollador (Recomendado para uso personal)

1. **Descarga o clona este repositorio**
   ```bash
   git clone https://github.com/GTula/instagram_pro.git
   ```

2. **Abre Chrome/Edge**
   - Navega a `chrome://extensions/` (o `edge://extensions/`)

3. **Activa el Modo Desarrollador**
   - Usa el toggle en la esquina superior derecha

4. **Carga la extensión**
   - Click en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta del repositorio

5. **¡Listo!**
   - La extensión aparecerá en tu barra de herramientas

## 📖 Cómo Usar

### Para Seguir Usuarios (Follow)

1. **Abre Instagram** en tu navegador
2. **Navega** a la lista de usuarios que quieres seguir:
   - Lista de seguidores de otro usuario
   - Página de explorar
   - Resultados de búsqueda
3. **Abre la extensión** (click en el icono)
4. **Configura**:
   - Selecciona la velocidad (usa "Segura" para evitar baneos)
   - Establece el límite de acciones (recomendado: 50-100 máx.)
5. **Click en "Seguir en Masa"**
6. La extensión comenzará a seguir usuarios automáticamente

### Para Dejar de Seguir (Unfollow)

1. **Abre Instagram** en tu navegador
2. **Ve a tu perfil** → "Siguiendo" para ver la lista
3. **Abre la extensión** (click en el icono)
4. **Configura** velocidad y límite
5. **Click en "Dejar de Seguir"**
6. La extensión procesará los unfollows con confirmaciones automáticas

## ⚠️ Consejos de Seguridad

### Límites Recomendados (para evitar baneos)

- **Máximo por sesión**: 50-100 acciones
- **Tiempo entre sesiones**: 1-2 horas mínimo
- **Máximo diario**: 200-300 acciones totales
- **Velocidad recomendada**: Siempre usa "Segura"

### Mejores Prácticas

✅ **SÍ hacer:**
- Usar la velocidad "Segura" especialmente al inicio
- Espaciar las sesiones de uso
- Variar los patrones (no uses siempre a la misma hora)
- Detener si recibes avisos de Instagram
- Usar límites conservadores (empieza con 20-30)

❌ **NO hacer:**
- Usar la extensión 24/7
- Exceder 500 acciones por día
- Usar en cuentas nuevas (espera al menos 2 semanas)
- Ignorar advertencias de Instagram
- Usar velocidad "Rápida" regularmente

### Señales de Advertencia

Si Instagram:
- Te pide verificar tu identidad
- Bloquea temporalmente acciones
- Muestra mensajes de "Intenta más tarde"

**→ DETÉN inmediatamente y espera 24-48 horas**

## 🛠️ Características Técnicas

- **Manifest V3**: Usa la última versión de extensiones de Chrome
- **Content Script**: Se ejecuta en páginas de Instagram
- **Almacenamiento Sync**: Guarda preferencias entre sesiones
- **Background Worker**: Gestiona comunicación entre componentes

## 📋 Estructura del Proyecto

```
instagram_pro/
├── manifest.json       # Configuración de la extensión
├── popup.html         # Interfaz de usuario
├── popup.css          # Estilos de la UI
├── popup.js           # Lógica de la UI
├── content.js         # Script que interactúa con Instagram
├── background.js      # Service worker
└── icons/             # Iconos de la extensión
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 🔒 Privacidad y Seguridad

- ✅ **No almacena contraseñas**: Usa la sesión existente de Instagram
- ✅ **No envía datos externos**: Todo se ejecuta localmente
- ✅ **Código abierto**: Puedes revisar todo el código
- ✅ **Sin tracking**: No recopila ningún dato del usuario

## ⚖️ Descargo de Responsabilidad

Esta herramienta es para uso educativo y personal. El uso de automatización en Instagram puede violar sus Términos de Servicio. Usa esta extensión bajo tu propia responsabilidad.

**Los desarrolladores no se hacen responsables de:**
- Cuentas bloqueadas o baneadas
- Pérdida de seguidores
- Violación de términos de servicio
- Cualquier otro problema derivado del uso de esta extensión

## 🤝 Contribuir

Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Abre un issue describiendo el problema o mejora
2. Haz un fork del repositorio
3. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
4. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🐛 Problemas Conocidos

- Instagram actualiza frecuentemente su interfaz, lo que puede requerir actualizaciones
- Los botones pueden tener diferentes textos según el idioma del navegador
- Algunas listas muy largas pueden requerir scrolling manual

## 📞 Soporte

Si tienes problemas:
1. Verifica que estás en una página de Instagram válida
2. Asegúrate de que la lista de usuarios esté visible
3. Revisa la consola del navegador (F12) para errores
4. Abre un issue en GitHub con los detalles

## 🎯 Roadmap

- [ ] Filtros avanzados (por número de seguidores, etc.)
- [ ] Exportar estadísticas
- [ ] Lista de usuarios procesados
- [ ] Pausar y reanudar operaciones
- [ ] Soporte multi-idioma mejorado
- [ ] Modo "Smart" que ajusta velocidad automáticamente

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**