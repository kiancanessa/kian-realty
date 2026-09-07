# -*- coding: utf-8 -*-
"""Genera el tutorial en PDF para subir propiedades al sitio.

Las capturas de images/ se toman del panel real con shots.mjs (mismo directorio),
así que cuando el editor cambie basta con volver a capturarlas y correr este archivo.

    python build_pdf.py
"""
import os
import shutil
from datetime import date

from PIL import Image as PILImage

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak,
)

BASE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(BASE, "images")
OUT = os.path.join(BASE, "Tutorial_Subir_Propiedades_El_Casa_Rosarito.pdf")
BUILD = os.path.join(BASE, ".build")   # JPEG intermedios, no se versionan

# Paleta de la marca, tomada de app/globals.css
INK = colors.HexColor("#23221E")
ACCENT = colors.HexColor("#6B8A42")
ACCENT_DARK = colors.HexColor("#47592B")
GRAY = colors.HexColor("#6E6C66")
LIGHT = colors.HexColor("#F0E7D8")
CREAM = colors.HexColor("#FAF6EE")
LINE = colors.HexColor("#D8D2C4")
WARN = colors.HexColor("#8A5A2B")

CONTENT_W = 6.7 * inch

styles = getSampleStyleSheet()
title_style = ParagraphStyle("TitleC", parent=styles["Title"], fontSize=26, textColor=INK, leading=30, spaceAfter=6)
subtitle_style = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=12.5, textColor=GRAY, alignment=TA_CENTER, leading=18, spaceAfter=6)
h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=14, textColor=colors.white, spaceBefore=0, spaceAfter=0, leading=19)
h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=12.5, textColor=ACCENT_DARK, spaceBefore=14, spaceAfter=6)
body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10.4, leading=15.5, spaceAfter=7, textColor=INK)
bullet = ParagraphStyle("Bullet", parent=body, leftIndent=14, bulletIndent=3, spaceAfter=4)
caption = ParagraphStyle("Cap", parent=styles["Normal"], fontSize=8.8, leading=12, textColor=GRAY,
                         alignment=TA_CENTER, spaceBefore=5, spaceAfter=14, fontName="Helvetica-Oblique")
box_text = ParagraphStyle("BoxText", parent=styles["Normal"], fontSize=9.8, leading=14, textColor=INK)
small = ParagraphStyle("Small", parent=styles["Normal"], fontSize=8.6, leading=11.5, textColor=GRAY)


def jpeg_for(filename):
    """Las capturas se guardan en PNG, pero un PNG por página deja un PDF de
    varios megas. Se embeben como JPEG para que el archivo se pueda mandar por
    correo o WhatsApp sin problema."""
    os.makedirs(BUILD, exist_ok=True)
    src = os.path.join(IMG, filename)
    dst = os.path.join(BUILD, os.path.splitext(filename)[0] + ".jpg")
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        PILImage.open(src).convert("RGB").save(dst, "JPEG", quality=82, optimize=True, subsampling=0)
    return dst


def step_header(number, text):
    """Banda verde numerada que abre cada paso."""
    label = Paragraph(f'<font size="11">PASO {number}</font> &nbsp;&nbsp; {text}', h1)
    t = Table([[label]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ACCENT),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def figure(filename, cap_text, width=CONTENT_W):
    im = Image(jpeg_for(filename))
    ratio = im.imageHeight / float(im.imageWidth)
    im.drawWidth = width
    im.drawHeight = width * ratio
    im.hAlign = "CENTER"
    box = Table([[im]], colWidths=[width + 0.16 * inch])
    box.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    return KeepTogether([box, Paragraph(cap_text, caption)])


def boxed_image(filename, width):
    """Imagen enmarcada sin KeepTogether — apta para ir dentro de una celda."""
    im = Image(jpeg_for(filename))
    im.drawWidth = width
    im.drawHeight = width * (im.imageHeight / float(im.imageWidth))
    im.hAlign = "CENTER"
    box = Table([[im]], colWidths=[width + 0.16 * inch])
    box.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    return box


def note(text, kind="tip"):
    """Recuadro de aviso. kind='tip' verde, kind='warn' ámbar."""
    accent = ACCENT if kind == "tip" else WARN
    bg = LIGHT if kind == "tip" else colors.HexColor("#F7EEE0")
    t = Table([[Paragraph(text, box_text)]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return KeepTogether([t, Spacer(1, 10)])


def bullets(items):
    return [Paragraph(f"•&nbsp;&nbsp;{it}", bullet) for it in items]


def faq_table(rows):
    data = [[Paragraph(f"<b>{q}</b>", box_text), Paragraph(a, box_text)] for q, a in rows]
    t = Table(data, colWidths=[2.45 * inch, CONTENT_W - 2.45 * inch])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("BACKGROUND", (0, 0), (0, -1), CREAM),
    ]))
    return t


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GRAY)
    canvas.drawString(0.9 * inch, 0.55 * inch, "El Casa Rosarito · Cómo subir una propiedad")
    canvas.drawRightString(letter[0] - 0.9 * inch, 0.55 * inch, f"Página {doc.page}")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.9 * inch, 0.72 * inch, letter[0] - 0.9 * inch, 0.72 * inch)
    canvas.restoreState()


story = []
A = story.append

# ─────────────────────────── Portada ───────────────────────────
A(Spacer(1, 0.75 * inch))
A(Paragraph("Cómo subir una propiedad", title_style))
A(Paragraph("Guía paso a paso del panel de El Casa Rosarito", subtitle_style))
A(Spacer(1, 8))
A(HRFlowable(width="45%", thickness=1, color=ACCENT, hAlign="CENTER"))
A(Spacer(1, 22))
A(figure("05-preview.png", "La vista previa: mientras escribes, ves cómo va quedando la propiedad.", width=2.6 * inch))
A(Spacer(1, 14))
A(Paragraph(
    "Estas son las propiedades <b>propias</b> del sitio: las que publicas tú, sin pasar por EasyBroker. "
    "Salen mezcladas con las de EasyBroker en el inicio y en la sección de Propiedades, con los mismos "
    "filtros y el mismo formulario de contacto.",
    ParagraphStyle("Lead", parent=body, alignment=TA_CENTER, textColor=GRAY)))
A(Spacer(1, 18))
A(Paragraph(f"Actualizado el {date.today().strftime('%d/%m/%Y')}", small))
A(PageBreak())

# ─────────────────────── Antes de empezar ───────────────────────
A(Paragraph("Antes de empezar", h2))
A(Paragraph("Ten esto listo y el proceso te toma unos cinco minutos:", body))
A(Spacer(1, 2))
for b in bullets([
    "Tu <b>correo y contraseña</b> del panel. Si no los tienes, pídeselos a Kian.",
    "Las <b>fotos ya en la computadora</b>, en JPG o PNG. Si están en el celular, pásalas antes por WhatsApp Web o correo.",
    "Los <b>datos de la propiedad</b>: precio, recámaras, baños, metros y la dirección o colonia.",
]):
    A(b)
A(Spacer(1, 12))
A(note(
    "<b>Nada se publica solo.</b> Puedes guardar a medias y seguir después: la propiedad queda como "
    "<b>borrador</b> y nadie la ve hasta que tú le des <b>Publicar</b>."))

# ─────────────────────────── Paso 1 ───────────────────────────
A(step_header(1, "Entra al panel"))
A(Spacer(1, 10))
for b in bullets([
    "Abre <b>elcasarosaritogroup.com/login</b> y entra con tu correo y contraseña.",
    "Arriba aparece el menú del panel. Haz clic en <b>PROPIEDADES</b>.",
]):
    A(b)
A(Spacer(1, 10))
A(figure("01-menu.png", "El menú del panel. La pestaña activa se marca en verde."))

# ─────────────────────────── Paso 2 ───────────────────────────
A(step_header(2, "Haz clic en Nueva propiedad"))
A(Spacer(1, 10))
A(Paragraph(
    "Aquí ves todas las propiedades propias que ya existen. El botón verde de arriba a la derecha "
    "crea una nueva.", body))
A(Spacer(1, 6))
A(figure("02-lista.png", "Pantalla de Propiedades propias, con el botón Nueva propiedad."))

# ─────────────────────────── Paso 3 ───────────────────────────
A(PageBreak())
A(step_header(3, "Conoce la pantalla: se divide en dos"))
A(Spacer(1, 10))
for b in bullets([
    "<b>A la izquierda</b> llenas los datos, en cinco bloques numerados.",
    "<b>A la derecha</b> ves la propiedad como va a salir en la página, y se actualiza sola mientras escribes.",
    "Abajo de la vista previa hay una <b>lista de verificación</b> con lo que todavía falta.",
]):
    A(b)
A(Spacer(1, 10))
A(figure("03-editor.png", "La pantalla completa: datos a la izquierda, vista previa a la derecha.", width=5.65 * inch))

# ─────────────────────────── Paso 4 ───────────────────────────
A(PageBreak())
A(step_header(4, "Sube las fotos"))
A(Spacer(1, 10))
for b in bullets([
    "<b>Arrastra las fotos</b> desde tu carpeta y suéltalas en el recuadro, o haz clic en <b>Agregar fotos</b>.",
    "Puedes seleccionar varias de una vez.",
    "La <b>primera foto es la portada</b>: la que sale en la tarjeta y en los resultados de búsqueda.",
]):
    A(b)
A(Spacer(1, 8))
A(figure("04-fotos.png", "Las fotos cargadas. La primera lleva la etiqueta PORTADA."))
A(Paragraph("Sobre cada foto hay tres controles:", body))
for b in bullets([
    "<b>★ Estrella</b> — convierte esa foto en la portada.",
    "<b>‹ ›  Flechas</b> — mueven la foto de lugar.",
    "<b>✕ Equis</b> — quita la foto.",
]):
    A(b)
A(Spacer(1, 8))
A(note(
    "<b>La portada decide si hacen clic o no.</b> Usa una foto horizontal, con buena luz, de la fachada "
    "o de la vista. Evita fotos verticales de celular y fotos del interior como portada."))

# ─────────────────────────── Paso 5 ───────────────────────────
A(step_header(5, "Llena los datos"))
A(Spacer(1, 10))
A(Paragraph("<b>02 Lo básico</b> — lo único obligatorio son título y ubicación.", body))
for b in bullets([
    "<b>Título</b> — corto y claro: <i>Casa moderna con vista al mar</i>. Es lo primero que se lee.",
    "<b>Ubicación</b> — colonia y ciudad: <i>Puerto Nuevo, Playas de Rosarito</i>.",
    "<b>Operación</b> — Venta o Renta. En renta, el precio se muestra por mes.",
    "<b>Tipo</b> — Casa, Departamento, Terreno… Define en qué filtro aparece.",
    "<b>Precio y moneda</b> — solo el número, sin comas ni signo de pesos. Si lo dejas vacío, sale <i>Precio a consultar</i>.",
]):
    A(b)
A(Spacer(1, 8))
A(Paragraph("<b>03 Detalles</b> — recámaras, baños, estacionamientos y metros.", body))
A(Paragraph(
    "Estos datos salen debajo del título en la tarjeta y además alimentan los filtros de búsqueda. "
    "Una propiedad sin ellos aparece en menos búsquedas.", body))
A(Spacer(1, 4))
A(Paragraph("<b>04 Descripción</b> — el texto de la página de la propiedad.", body))
A(Paragraph(
    "Dos o tres frases bastan: qué la hace especial, acabados, amenidades y qué hay cerca.", body))
A(Spacer(1, 4))
A(Paragraph("<b>05 Mapa</b> — opcional.", body))
A(Paragraph(
    "Si pones latitud y longitud, la página muestra el mapa. Para obtenerlas: abre <b>Google Maps</b>, "
    "haz <b>clic derecho</b> sobre el punto exacto y copia los dos números que aparecen arriba del menú. "
    "El primero es la latitud y el segundo la longitud.", body))

# ─────────────────────────── Paso 6 ───────────────────────────
A(PageBreak())
A(step_header(6, "Revisa la vista previa"))
A(Spacer(1, 10))
A(Paragraph(
    "La tarjeta de la derecha es la misma que usa la página, así que lo que ves ahí es exactamente lo "
    "que va a ver el cliente.", body))
A(Spacer(1, 8))

prev = Table(
    [[boxed_image("05-preview.png", 2.7 * inch), boxed_image("06-movil.png", 2.7 * inch)],
     [Paragraph("En computadora.", caption), Paragraph("En celular.", caption)]],
    colWidths=[CONTENT_W / 2, CONTENT_W / 2])
prev.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, 0), "TOP"),
    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ("LEFTPADDING", (0, 0), (-1, -1), 2),
    ("RIGHTPADDING", (0, 0), (-1, -1), 2),
]))
A(prev)
A(Spacer(1, 4))
A(note(
    "<b>Revisa siempre en celular.</b> Con los botones de arriba a la derecha cambias entre computadora "
    "y celular. Seis de cada diez visitas al sitio son desde el teléfono, así que ahí es donde más "
    "importa que el título no se corte y que la portada se vea bien."))
A(Paragraph(
    "Debajo de la vista previa, la lista <b>Antes de publicar</b> te dice qué falta. Los dos primeros "
    "son obligatorios; los demás no bloquean, pero una propiedad sin fotos, sin precio o sin descripción "
    "genera muchos menos contactos.", body))

# ─────────────────────────── Paso 7 ───────────────────────────
A(PageBreak())
A(step_header(7, "Guarda"))
A(Spacer(1, 10))
A(figure("07-guardar.png", "Los botones del final: Cancelar descarta todo, Guardar conserva el trabajo."))
for b in bullets([
    "<b>Guardar</b> conserva la propiedad, pero <b>todavía no la publica</b>: queda como borrador.",
    "<b>Cancelar</b> descarta los cambios de esta sesión.",
    "Si el botón Guardar está <b>gris</b>, es porque falta el título o la ubicación.",
]):
    A(b)

# ─────────────────────────── Paso 8 ───────────────────────────
A(step_header(8, "Publica"))
A(Spacer(1, 10))
A(Paragraph(
    "De vuelta en la lista, la propiedad aparece marcada como <b>BORRADOR</b>. Haz clic en "
    "<b>PUBLICAR</b> y en ese momento entra al sitio.", body))
A(Spacer(1, 6))
A(figure("08-publicar.png", "La propiedad en borrador, con el botón Publicar."))
for b in bullets([
    "<b>Publicar</b> — la pone en línea de inmediato.",
    "<b>Icono de flecha</b> — abre la propiedad en el sitio para verla como el cliente.",
    "<b>Lápiz</b> — vuelve a abrir el editor para corregir.",
    "<b>Bote de basura</b> — la elimina. Esto no se puede deshacer.",
]):
    A(b)
A(Spacer(1, 10))
A(note(
    "<b>¿Se vendió o se rentó?</b> No la borres: usa <b>Despublicar</b>. Sale del sitio pero se queda "
    "guardada con sus fotos, por si la vuelves a necesitar.", kind="warn"))

# ─────────────────────── Problemas comunes ───────────────────────
A(PageBreak())
A(Paragraph("Si algo no sale como esperas", h2))
A(Spacer(1, 4))
A(faq_table([
    ("El botón Guardar está gris",
     "Falta el título o la ubicación. Son los dos únicos campos obligatorios."),
    ("Guardé pero no la veo en la página",
     "Quedó en borrador. Vuelve a la lista y haz clic en PUBLICAR."),
    ("La foto de portada no es la que quiero",
     "Pasa el cursor sobre la foto correcta y haz clic en la estrella ★."),
    ("Las fotos salen en desorden",
     "Arrástralas para reacomodarlas, o usa las flechas ‹ › de cada foto."),
    ("El precio se ve raro",
     "Escribe solo el número, sin comas ni signo de pesos: 395000, no $395,000."),
    ("¿Choca con las de EasyBroker?",
     "No. Las tuyas y las de EasyBroker se mezclan en la misma lista y usan los mismos filtros."),
    ("Subí una foto por error",
     "Haz clic en la ✕ de esa foto y vuelve a guardar."),
]))
A(Spacer(1, 18))

A(Paragraph("Tres cosas que hacen la diferencia", h2))
for b in bullets([
    "<b>Portada horizontal y con luz de día.</b> Es lo único que ve el cliente antes de decidir si entra.",
    "<b>Llena recámaras, baños y metros.</b> Sin eso la propiedad no aparece cuando alguien filtra.",
    "<b>Escribe la descripción pensando en el que llega de fuera.</b> Menciona la playa, la distancia a la "
    "frontera y qué hay alrededor.",
]):
    A(b)
A(Spacer(1, 20))
A(HRFlowable(width="100%", thickness=0.5, color=LINE))
A(Spacer(1, 8))
A(Paragraph(
    "¿Dudas o algo no funciona? Escríbele a Kian y lo revisamos. "
    "Este documento se actualiza cuando cambia el panel.", small))


doc = SimpleDocTemplate(
    OUT, pagesize=letter,
    leftMargin=0.9 * inch, rightMargin=0.9 * inch,
    topMargin=0.85 * inch, bottomMargin=0.9 * inch,
    title="Cómo subir una propiedad — El Casa Rosarito",
    author="El Casa Rosarito",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
shutil.rmtree(BUILD, ignore_errors=True)
print("PDF generado:", OUT)
