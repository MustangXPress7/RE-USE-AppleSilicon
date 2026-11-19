# RE-USE Speech Enhancement (Mac Beta) — launcher puente

Instalador delgado para probar en Mac la rama `mac-mlx` del launcher principal.

La UI de Pinokio 8.3.7 (*Create App → Download*) no permite elegir rama: clona
con `git clone --depth 1 --single-branch`. Este repo existe solo para que el
betatester pueda **pegar una URL** y recibir la versión Apple Silicon.

## Qué hace

1. `install.js` clona `--branch mac-mlx` el repo
   `MustangXPress7/NemotronLabs-RE-USE-Pinokio_Win-Nvidia` dentro de `app/`.
2. Ejecuta `app/install.js`: entorno Python 3.12, dependencias LiteRT, grafos en
   `app/models_litert/` y verificación con `app/verify_mac.py`.
3. El menú (`pinokio.js`) apunta a los scripts reales dentro de `app/`.

El código de la app **no está duplicado**: vive en la rama `mac-mlx` del repo
principal. Cuando haya cambios, este puente no necesita actualizarse.

## Uso para el betatester

En Pinokio → **Create App → Download**:

```
https://github.com/MustangXPress7/RE-USE-AppleSilicon.git
```

Nombre de carpeta: `RE-USE-AppleSilicon`.

Después, en Home → **Install** → **Run RE-USE** → pestaña **Open UI**.

## Requisitos y límites

- macOS en Apple Silicon (`arm64`). En otra plataforma el install de la app aborta.
- Mejora de archivos **offline**, 16 kHz mono; no es filtro de micro en tiempo real.
- Descarga ~196 MB de grafos LiteRT en la primera instalación.

Si algo falla, adjunta `logs/api/`, `logs/shell/` y la salida de
`python verify_mac.py` (todo dentro de la carpeta `app/`).

## API

### JavaScript (Pinokio)

```javascript
{ method: "script.start", params: { uri: "install.js" } }
{ method: "script.start", params: { uri: "app/run.js" } }
{ method: "script.start", params: { uri: "app/verify.js" } }
```

La URL de Gradio la guarda `app/run.js` en su variable local `url`; el menú la
lee con `info.local('app/run.js')`.

### Python

```python
import sys
sys.path.insert(0, "app")
from mac_backend import ReuseLiteRT, read_audio, write_wav

x, sr = read_audio("ruido.wav")
backend = ReuseLiteRT.load("standard", graph="fastload", accel="gpu")
write_wav("app/output/ruido_enhanced.wav", backend.enhance(x).samples)
backend.close()
```

### Curl

```bash
curl -s -X POST "http://127.0.0.1:7860/run/predict" \
  -H "Content-Type: application/json" \
  -d '{"data":["/ruta/a/ruido.wav","standard","fastload","gpu"],"fn_index":0}'
```

Usa siempre la URL capturada por `app/run.js` en lugar de hardcodear el puerto.
