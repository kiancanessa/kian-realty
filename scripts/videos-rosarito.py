"""
Videos de la sección "Vive Rosarito" y del fondo del inicio.

Todos vienen de Pexels (licencia libre: uso comercial permitido, sin atribución
obligatoria). Se da crédito de todos modos en la sección.

    Ilia Devaltovskii — tomas de Rosarito, B.C. (muelle, rocas, atardeceres):
      https://www.pexels.com/video/pacific-ocean-waves-baja-california-mexico-rosarito-20082338/
      https://www.pexels.com/video/pacific-ocean-waves-baja-california-mexico-rosarito-20082330/
      https://www.pexels.com/video/pacific-ocean-waves-baja-california-mexico-rosarito-20084497/
      https://www.pexels.com/video/pacific-ocean-waves-baja-california-mexico-rosarito-20084710/
    Surf (costa del Pacífico, NO es Rosarito — no se rotula como tal):
      https://www.pexels.com/video/man-surfing-on-sea-waves-during-daytime-7425556/

Descarga los originales a una carpeta y pásala como argumento:

    curl -L -o 20082338.mp4 https://www.pexels.com/download/video/20082338/
    python scripts/videos-rosarito.py ruta/a/originales

Cada clip se recorta a su mejor momento y se RE-CODIFICA: H.264 sin audio,
`+faststart` para que empiece antes de bajar completo, y un póster WebP.
Los nombres de salida son los que leen `CoastVideos.tsx` y `Hero.tsx`.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "public" / "videos" / "rosarito"

# nombre: (archivo, inicio s, duración s, ancho, alto, póster s dentro del corte)
CLIPS: dict[str, tuple[str, float, float, int, int, float]] = {
    # El surfista toma la ola y la corre (después sólo queda espuma).
    "surf": ("7425556.mp4", 0.0, 8.0, 720, 1280, 2.5),
    # El dron se abre y aparece la costa con el hotel al fondo.
    "muelle": ("20082338.mp4", 18.0, 13.0, 1280, 720, 11.0),
    "playa": ("20084710.mp4", 4.0, 10.0, 1280, 720, 3.0),
    "atardecer": ("20084497.mp4", 0.0, 10.0, 1280, 720, 1.0),
}

LIMPIEZA = "fps=30,format=yuv420p"


def correr(args: list[str]) -> None:
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def x264(crf: int, maxrate: str) -> list[str]:
    return [
        "-an", "-map_metadata", "-1", "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
        "-maxrate", maxrate, "-bufsize", "4000k", "-profile:v", "high", "-movflags", "+faststart",
    ]


def poster(mp4: Path, segundo: float, destino: Path) -> None:
    correr(["-ss", str(segundo), "-i", str(mp4), "-frames:v", "1", "-c:v", "libwebp", "-quality", "78", str(destino)])


def hero(origen: Path) -> None:
    """Oleaje sobre las rocas, en bucle sin corte.

    Los últimos 1.5 s se funden con el principio: el video termina justo en el
    cuadro donde empieza, así que al repetirse no hay salto."""
    src = origen / "20082330.mp4"
    fundido, largo = 1.5, 19.0
    for alto, crf, rate in ((1080, 27, "3000k"), (720, 28, "1500k")):
        out = DESTINO.parent / f"hero-waves-{alto}.mp4"
        correr([
            "-i", str(src),
            "-filter_complex",
            f"[0:v]scale=-2:{alto},{LIMPIEZA},split[a][b];"
            f"[a]trim={fundido}:{largo},setpts=PTS-STARTPTS[cuerpo];"
            f"[b]trim=0:{fundido},setpts=PTS-STARTPTS[inicio];"
            f"[cuerpo][inicio]xfade=transition=fade:duration={fundido}:offset={largo - 2 * fundido},format=yuv420p[v]",
            "-map", "[v]", *x264(crf, rate), str(out),
        ])
        print(f"hero {alto}p: {out.stat().st_size / 1e6:.1f} MB")
    poster(DESTINO.parent / "hero-waves-1080.mp4", 0.0, DESTINO.parent / "hero-waves.webp")


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("Uso: python scripts/videos-rosarito.py <carpeta con los originales>")
    origen = Path(sys.argv[1])
    DESTINO.mkdir(parents=True, exist_ok=True)

    for nombre, (archivo, inicio, duracion, ancho, alto, seg_poster) in CLIPS.items():
        src = origen / archivo
        if not src.exists():
            sys.exit(f"Falta {src}")
        mp4 = DESTINO / f"{nombre}.mp4"
        escala = f"scale={ancho}:{alto}:force_original_aspect_ratio=increase,crop={ancho}:{alto}"
        # Entra y sale en fundido para que el bucle no corte de golpe.
        fundidos = f"fade=t=in:st=0:d=0.4,fade=t=out:st={duracion - 0.5}:d=0.5"
        correr([
            "-ss", str(inicio), "-t", str(duracion), "-i", str(src),
            "-vf", f"{escala},{LIMPIEZA},{fundidos}", *x264(28, "1600k"), str(mp4),
        ])
        poster(mp4, seg_poster, DESTINO / f"{nombre}.webp")
        print(f"{nombre}: {mp4.stat().st_size / 1e6:.1f} MB")

    hero(origen)


if __name__ == "__main__":
    main()
