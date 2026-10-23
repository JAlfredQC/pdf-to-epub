# PDF to EPUB Converter

Aplicación web para convertir archivos PDF a EPUB con OCR, reglas regex personalizadas y diccionario de corrección.

## 🚀 Características

- **OCR Integrado**: Procesamiento de PDFs escaneados con Tesseract.js
- **Vista de Comparación**: Comparación lado a lado entre original y procesado
- **Reglas Regex**: Editor de expresiones regulares con 215+ reglas predefinidas
- **Diccionario Personalizado**: Corrección automática de errores comunes
- **Plantillas EPUB**: Plantillas profesionales basadas en ePubLibre 3.0
- **Diccionario Ortográfico**: Integración con Hunspell para validación

## 🌐 Demo en Vivo

[Ver aplicación en GitHub Pages](https://TU-USUARIO.github.io/pdf-to-epub/)

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS
- PDF.js (extracción de PDF)
- Tesseract.js (OCR)
- JSZip (generación de EPUB)

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📦 Deploy

Esta aplicación se despliega automáticamente en GitHub Pages usando GitHub Actions.

Cada push a la rama `main` dispara un deployment automático.

## 📄 Licencia

MIT
