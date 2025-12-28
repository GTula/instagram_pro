#!/bin/bash
# Script to package Instagram Pro extension for Chrome Web Store

echo "📦 Empaquetando Instagram Pro para Chrome Web Store..."

# Version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')

# Output filename
OUTPUT="instagram_pro_v${VERSION}.zip"

# Remove old package if exists
if [ -f "$OUTPUT" ]; then
    echo "🗑️  Eliminando paquete anterior..."
    rm "$OUTPUT"
fi

# Create ZIP with only necessary files
echo "📁 Creando archivo ZIP..."
zip -r "$OUTPUT" \
    manifest.json \
    popup.html \
    popup.css \
    popup.js \
    content.js \
    background.js \
    license.js \
    icons/ \
    -x "*.DS_Store" \
    -x "__MACOSX/*"

# Check if ZIP was created successfully
if [ -f "$OUTPUT" ]; then
    SIZE=$(du -h "$OUTPUT" | cut -f1)
    echo "✅ Paquete creado exitosamente: $OUTPUT ($SIZE)"
    echo ""
    echo "📋 Contenido del paquete:"
    unzip -l "$OUTPUT"
    echo ""
    echo "🚀 Siguiente paso:"
    echo "   1. Ve a https://chrome.google.com/webstore/devconsole"
    echo "   2. Sube el archivo: $OUTPUT"
    echo "   3. Completa la información de la tienda"
    echo ""
    echo "📚 Ver CHROME_STORE_GUIDE.md para más detalles"
else
    echo "❌ Error al crear el paquete"
    exit 1
fi
