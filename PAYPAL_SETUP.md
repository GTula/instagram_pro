# 💳 Guía Completa de Configuración de PayPal

## ¿Por qué PayPal?

✅ **Acepta pagos de 200+ países**  
✅ **Tarjetas Visa, Mastercard, AmEx, Discover**  
✅ **No requiere cuenta PayPal** (pago como invitado)  
✅ **Muy confiable y seguro**  
✅ **Comisión: 4-6%** (competitivo)  
✅ **Fácil de configurar** (15-30 minutos)

---

## Paso 1: Crear Cuenta PayPal Business

### 1. Registrarte

1. Ve a [paypal.com](https://www.paypal.com)
2. Click en "Registrarse"
3. Selecciona **"Cuenta Business"** (importante)
4. Completa tus datos:
   - Nombre de empresa: Optima Solutions
   - Email: contacto@optimasolutions.uy
   - Contraseña segura

### 2. Verificar tu Cuenta

1. Confirma tu email (check inbox)
2. Vincula tu cuenta bancaria:
   - En Uruguay: BROU, Itaú, Santander, etc.
   - Necesitarás: CBU o número de cuenta
3. Completa verificación de identidad (puede pedir cédula/pasaporte)

**Tiempo estimado:** 2-5 días para verificación completa

---

## Paso 2: Obtener Client ID de PayPal

### 1. Acceder al Dashboard de Desarrolladores

1. Ve a [developer.paypal.com](https://developer.paypal.com/dashboard/)
2. Inicia sesión con tu cuenta PayPal
3. Click en "Apps & Credentials"

### 2. Crear una App

1. Click en **"Create App"**
2. Nombre de app: "Instagram Pro License Sales"
3. Selecciona tipo: **"Merchant"**
4. Click **"Create App"**

### 3. Obtener Credenciales

Verás dos tipos de credenciales:

#### **Sandbox** (Pruebas)
```
Client ID: SB-XXXXXXXXXXXXXXXXXX
Secret: EL-XXXXXXXXXXXXXXXXXX
```

#### **Live** (Producción)
```
Client ID: AY-XXXXXXXXXXXXXXXXXX
Secret: EL-XXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANTE:** 
- Usa **Sandbox** primero para probar
- Cambia a **Live** cuando estés listo para vender

---

## Paso 3: Configurar buy-license.html

### 1. Abrir el Archivo

```bash
# Editar buy-license.html
code buy-license.html
# O usa cualquier editor de texto
```

### 2. Reemplazar Client ID

Busca esta línea (cerca de la línea 420):

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR-CLIENT-ID&currency=USD"></script>
```

**Reemplaza** `YOUR-CLIENT-ID` con tu Client ID real:

```html
<!-- Para pruebas (Sandbox) -->
<script src="https://www.paypal.com/sdk/js?client-id=SB-ABC123XYZ456&currency=USD"></script>

<!-- Para producción (Live) -->
<script src="https://www.paypal.com/sdk/js?client-id=AY-ABC123XYZ456&currency=USD"></script>
```

### 3. Guardar y Subir

```bash
# Sube el archivo actualizado a tu hosting
scp buy-license.html usuario@optimasolutions.uy:/ruta/instagram-pro/

# O usa Netlify/GitHub Pages (arrastra archivo)
```

---

## Paso 4: Probar los Pagos

### 1. Modo Sandbox (Pruebas)

PayPal te da cuentas de prueba:

**Cuenta de vendedor (tú):**
- Email: sb-seller123@business.example.com
- Contraseña: (generada automáticamente)

**Cuenta de comprador (cliente de prueba):**
- Email: sb-buyer123@personal.example.com
- Contraseña: (generada automáticamente)
- **Tarjeta de prueba:** 4032039974960896 (Visa)

### 2. Hacer una Compra de Prueba

1. Abre `buy-license.html` en tu navegador
2. Click en un botón de PayPal
3. Inicia sesión con la **cuenta de comprador** de prueba
4. Completa el pago
5. Verifica que recibes la notificación

### 3. Ver Transacciones de Prueba

1. Ve a [sandbox.paypal.com](https://www.sandbox.paypal.com)
2. Inicia sesión con tu cuenta **de vendedor** de prueba
3. Verás la transacción en "Activity"

---

## Paso 5: Activar Modo Producción

### 1. Cambiar a Client ID Live

En `buy-license.html`, reemplaza el Client ID de Sandbox por el de Live:

```html
<!-- Antes (Sandbox) -->
<script src="https://www.paypal.com/sdk/js?client-id=SB-ABC123&currency=USD"></script>

<!-- Después (Live - Producción) -->
<script src="https://www.paypal.com/sdk/js?client-id=AY-XYZ789&currency=USD"></script>
```

### 2. Verificar que la App Esté Aprobada

1. Ve a [developer.paypal.com/dashboard/](https://developer.paypal.com/dashboard/)
2. En tu app, verifica que esté en modo **"Live"**
3. Si dice "Limited", puede requerir verificación adicional

---

## Paso 6: Recibir Notificaciones de Pago

### Opción 1: Email Automático (Más Simple)

PayPal te envía email automáticamente cuando recibes un pago:

```
De: service@paypal.com
Asunto: Recibiste un pago de $4.99 USD de Juan Pérez

Detalles:
- Comprador: juan.perez@email.com
- Monto: $4.99 USD
- ID transacción: 1AB23456CD789012E
```

**Flujo:**
1. Recibes email de PayPal
2. Generas licencia: `node generate-license.js monthly`
3. Envías licencia por email a juan.perez@email.com

### Opción 2: Webhooks (Automático - Avanzado)

Para automatizar 100%:

1. En tu app de PayPal, ve a "Webhooks"
2. Agregar webhook URL: `https://tu-backend.com/paypal-webhook`
3. Selecciona evento: **"Payment capture completed"**
4. PayPal enviará POST con datos del pago
5. Tu backend genera y envía licencia automáticamente

**Ejemplo de código backend (Node.js):**

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/paypal-webhook', express.json(), async (req, res) => {
  const event = req.body;
  
  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const buyerEmail = event.resource.payer.email_address;
    const amount = event.resource.amount.value;
    const orderId = event.resource.id;
    
    // Generar licencia
    const license = generateLicense('monthly'); // o detectar plan por monto
    
    // Enviar email con licencia
    await sendEmail(buyerEmail, license);
    
    console.log('Licencia enviada a', buyerEmail);
  }
  
  res.sendStatus(200);
});

app.listen(3000);
```

---

## Paso 7: Retirar el Dinero

### PayPal → Banco

1. Inicia sesión en [paypal.com](https://www.paypal.com)
2. Click en **"Transferir dinero"**
3. Selecciona **"Transferir a tu banco"**
4. Elige monto y cuenta bancaria
5. El dinero llega en **3-5 días hábiles**

### Comisiones

- **Recibir pago:** 4.4% + $0.30 USD (estándar en Uruguay)
- **Retiro a banco:** $0 (gratis en Uruguay)
- **Conversión de moneda:** ~3% (si recibes USD y retiras UYU)

**Ejemplo:**
- Cliente paga: $4.99 USD
- Comisión PayPal: $0.52 USD
- Recibes: $4.47 USD (~$176 UYU aprox)

---

## Problemas Comunes y Soluciones

### ❌ "PayPal SDK no cargado"

**Causa:** Client ID incorrecto o red bloqueada

**Solución:**
1. Verifica que el Client ID sea correcto
2. Revisa la consola del navegador (F12)
3. Asegúrate de estar en HTTPS (no HTTP)

### ❌ "Botones no aparecen"

**Causa:** JavaScript bloqueado o error en el código

**Solución:**
1. Abre consola del navegador (F12)
2. Revisa errores en rojo
3. Verifica que el archivo tenga la última versión

### ❌ "Pago rechazado"

**Causa:** Tarjeta sin fondos o cuenta PayPal sin verificar

**Solución:**
- En Sandbox: Usa las tarjetas de prueba de PayPal
- En Live: Cliente debe verificar su método de pago

### ❌ "No recibo notificaciones"

**Causa:** Configuración de email en PayPal

**Solución:**
1. Ve a Configuración → Notificaciones
2. Activa "Recibir emails cuando recibo un pago"
3. Verifica que tu email esté confirmado

---

## Mejores Prácticas

### ✅ Seguridad

- **Nunca** compartas tu Secret Key (solo Client ID)
- Usa HTTPS siempre (no HTTP)
- Valida pagos en el servidor (webhook)
- No confíes solo en el JavaScript del cliente

### ✅ Experiencia de Usuario

- Muestra claramente los precios en USD
- Incluye capturas de pantalla de la extensión
- Ofrece garantía de 7 días (aumenta conversión)
- Responde emails rápido (1-2 horas ideal)

### ✅ Legal

- Incluye política de privacidad
- Términos y condiciones claros
- Política de reembolso visible
- Aviso de que puede violar TOS de Instagram

---

## Alternativas a PayPal

### Si PayPal no funciona para ti:

| Método | Cobertura | Comisión | Dificultad | Mejor para |
|--------|-----------|----------|------------|------------|
| **Stripe** | Global | 2.9% + $0.30 | Media | Internacional |
| **Mercado Pago** | LatAm | 3-5% | Baja | Uruguay/Argentina |
| **Gumroad** | Global | 10% | Muy baja | Automatización total |
| **Paddle** | Global | 5% + $0.50 | Media | SaaS |

---

## Checklist Final

Antes de lanzar:

- [ ] Cuenta PayPal Business creada y verificada
- [ ] Cuenta bancaria vinculada
- [ ] App de PayPal creada en developer.paypal.com
- [ ] Client ID reemplazado en buy-license.html
- [ ] Probado en modo Sandbox (al menos 3 pagos de prueba)
- [ ] Cambiado a Client ID Live (producción)
- [ ] Página subida a optimasolutions.uy
- [ ] Primer pago real probado ($1 a ti mismo)
- [ ] Notificaciones de email activadas
- [ ] Script de generación de licencias listo
- [ ] Template de email para enviar licencias preparado

---

## Soporte

**Documentación oficial de PayPal:**
- Guía de inicio: https://developer.paypal.com/docs/checkout/
- SDK de JavaScript: https://developer.paypal.com/sdk/js/
- Webhooks: https://developer.paypal.com/docs/api-basics/notifications/webhooks/

**¿Necesitas ayuda?**

Si tienes problemas con la configuración, responde al PR o contacta en:
- Email: [tu_email]
- PayPal Support: https://www.paypal.com/support

---

## Próximos Pasos

1. ✅ Configura PayPal (esta guía)
2. 📧 Crea template de email para enviar licencias
3. 🚀 Publica en Chrome Web Store
4. 📣 Marketing y promoción
5. 💰 ¡Empieza a ganar!

**¡Buena suerte con las ventas! 🎉**
