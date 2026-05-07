import twilio from 'twilio';

const TIMEZONE_CL = 'America/Santiago';

/**
 * SERVICIO DE NOTIFICACIONES WHATSAPP VÍA TWILIO (TEMPLATE APROBADO)
 *
 * Envía mensajes usando contentSid + contentVariables.
 * Requiere variables de entorno:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_WHATSAPP_FROM  (ej: +12605537594)
 * - TWILIO_CONTENT_SID    (ej: HX0b7bd1b24b7822c0f8b92d6408947e6c)
 * - NOMBRE_EMPRESA        (se usa como nombre de clínica por defecto)
 */

/**
 * Formatea el teléfono al formato internacional de Chile para WhatsApp.
 * Acepta: 912345678, +56912345678, 56912345678, 0912345678
 */
function formatearTelefonoWhatsApp(telefono) {
    if (!telefono) return null;

    let limpio = telefono.replace(/[\s\-\(\)\.]/g, '');

    if (limpio.startsWith('+')) {
        return `whatsapp:${limpio}`;
    }

    if (limpio.startsWith('56') && limpio.length >= 11) {
        return `whatsapp:+${limpio}`;
    }

    if (limpio.startsWith('0')) {
        limpio = limpio.substring(1);
    }

    if (limpio.length === 9 && limpio.startsWith('9')) {
        return `whatsapp:+56${limpio}`;
    }

    return `whatsapp:+56${limpio}`;
}

function formatearFechaWhatsApp(fecha) {
    if (!fecha) return "";

    if (fecha instanceof Date && !Number.isNaN(fecha.getTime())) {
        return new Intl.DateTimeFormat('es-CL', {
            timeZone: TIMEZONE_CL,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(fecha);
    }

    const valor = String(fecha).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        const [year, month, day] = valor.split('-');
        return `${day}-${month}-${year}`;
    }

    const fechaDate = new Date(valor);
    if (!Number.isNaN(fechaDate.getTime())) {
        return new Intl.DateTimeFormat('es-CL', {
            timeZone: TIMEZONE_CL,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(fechaDate);
    }

    return valor;
}

function formatearHoraWhatsApp(hora) {
    if (!hora) return "";

    if (hora instanceof Date && !Number.isNaN(hora.getTime())) {
        return new Intl.DateTimeFormat('es-CL', {
            timeZone: TIMEZONE_CL,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(hora);
    }

    const valor = String(hora).trim();
    if (/^\d{2}:\d{2}:\d{2}$/.test(valor)) {
        return valor.slice(0, 5);
    }

    if (/^\d{2}:\d{2}$/.test(valor)) {
        return valor;
    }

    const horaDate = new Date(valor);
    if (!Number.isNaN(horaDate.getTime())) {
        return new Intl.DateTimeFormat('es-CL', {
            timeZone: TIMEZONE_CL,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(horaDate);
    }

    return valor;
}

/**
 * Envía un mensaje de WhatsApp usando el template aprobado de Twilio.
 *
 * @param {Object} params
 * @param {string} params.telefono  - Teléfono del paciente
 * @param {string} params.nombre    - Nombre del paciente
 * @param {string} params.clinica   - Nombre de la clínica (opcional, usa NOMBRE_EMPRESA)
 * @param {string} params.fecha     - Fecha de la cita (ej: "Lunes 28 de Julio 2025")
 * @param {string} params.hora      - Hora de la cita (ej: "10:30")
 * @returns {Promise<boolean>} true si se envió correctamente
 */


{/*
FUNCION QUE ENVIA UN MENSAJE DE WSP INGRESO Y NOTIFICACION DEL AGENDAMIENTO REALIZADO
*/}

export async function notificacionAgendamiento({ telefono, nombre, clinica, fecha, hora }) {
    const {
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_WHATSAPP_FROM,
        TWILIO_CONTENT_SID,
        NOMBRE_EMPRESA,
        DIRECCION_EMPRESA,
        TELEFONO_EMPRESA
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        console.warn("[WSP] Credenciales de Twilio no configuradas. Mensaje no enviado.");
        return false;
    }

    if(!DIRECCION_EMPRESA){
        console.warn(`[DIRECCION_EMPRESA] no ha sido configurado`);
        return false;
    }

    if (!TELEFONO_EMPRESA) {
        console.warn(`No ha sido configurado correctamente`);
        return false;
    }

    if (!TWILIO_WHATSAPP_FROM) {
        console.warn("[WSP] TWILIO_WHATSAPP_FROM no configurado. Mensaje no enviado.");
        return false;
    }

    if (!TWILIO_CONTENT_SID) {
        console.warn("[WSP] TWILIO_CONTENT_SID no configurado. Mensaje no enviado.");
        return false;
    }

    if (!telefono) {
        console.warn("[WSP] Teléfono vacío. Mensaje no enviado.");
        return false;
    }

    const destinatario = formatearTelefonoWhatsApp(telefono);
    if (!destinatario) {
        console.warn("[WSP] No se pudo formatear el teléfono:", telefono);
        return false;
    }

    const nombreClinica = clinica || NOMBRE_EMPRESA || "la clínica";
    const fromNumber = TWILIO_WHATSAPP_FROM.startsWith('+')
        ? TWILIO_WHATSAPP_FROM
        : `+${TWILIO_WHATSAPP_FROM}`;
    const fechaFormateada = formatearFechaWhatsApp(fecha);
    const horaFormateada = formatearHoraWhatsApp(hora);

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        await client.messages.create({
            from: `whatsapp:${fromNumber}`,
            to: destinatario,
            contentSid: TWILIO_CONTENT_SID,
            contentVariables: JSON.stringify({
                1: nombre,
                2: nombreClinica,
                3: fechaFormateada,
                4: horaFormateada,
                5: DIRECCION_EMPRESA,
                6: TELEFONO_EMPRESA,
            })
        });

        console.log(`[WSP] Mensaje enviado a ${destinatario} (${nombre} - ${fechaFormateada} ${horaFormateada})`);
        return true;
    } catch (error) {
        console.error("[WSP] Error al enviar mensaje:", error.message);
        return false;
    }
}




{/*
FUNCION QUE ENVIA UN MENSAJE DE WSP DESDE LA API DE TWILO UNA HORA ANTES
*/}

export async function enviarRecordatorio_1hora({ telefono, nombre, clinica, fecha, hora }) {
    const {
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
        TWILIO_WHATSAPP_FROM,
        TWILIO_CONTENT_SID_RECORDATORIO,
        NOMBRE_EMPRESA,
        TELEFONO_EMPRESA,
        DIRECCION_EMPRESA,
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        console.warn("[WSP] Credenciales de Twilio no configuradas. Mensaje no enviado.");
        return false;
    }

    if (!TELEFONO_EMPRESA) {
        console.warn(`[TELEFONO_EMPRESA], telefono empresa no configurado. Mensaje no enviado.`);
        return false;
    }

    if (!DIRECCION_EMPRESA) {
        console.warn(`[DIRECCION_EMPRESA], direccion no configuradas. Mensaje no enviado.`);
        return false;
    }

    if (!TWILIO_WHATSAPP_FROM) {
        console.warn("[WSP] TWILIO_WHATSAPP_FROM no configurado. Mensaje no enviado.");
        return false;
    }

    if (!TWILIO_CONTENT_SID_RECORDATORIO) {
        console.warn("[WSP] TWILIO_CONTENT_SID_RECORDATORIO no configurado. Mensaje no enviado.");
        return false;
    }

    if (!telefono) {
        console.warn("[WSP] Teléfono vacío. Mensaje no enviado.");
        return false;
    }

    const destinatario = formatearTelefonoWhatsApp(telefono);
    if (!destinatario) {
        console.warn("[WSP] No se pudo formatear el teléfono:", telefono);
        return false;
    }

    const nombreClinica = clinica || NOMBRE_EMPRESA || "la clínica";
    const fromNumber = TWILIO_WHATSAPP_FROM.startsWith('+')
        ? TWILIO_WHATSAPP_FROM
        : `+${TWILIO_WHATSAPP_FROM}`;
    const fechaFormateada = formatearFechaWhatsApp(fecha);
    const horaFormateada = formatearHoraWhatsApp(hora);

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        await client.messages.create({
            from: `whatsapp:${fromNumber}`,
            to: destinatario,
            contentSid: TWILIO_CONTENT_SID_RECORDATORIO,
            contentVariables: JSON.stringify({
                1: nombre,
                2: nombreClinica,
                3: fechaFormateada,
                4: horaFormateada,
                5: DIRECCION_EMPRESA,
                6: TELEFONO_EMPRESA
            })
        });

        console.log(`[WSP] Mensaje enviado a ${destinatario} (${nombre} - ${fechaFormateada} ${horaFormateada})`);
        return true;
    } catch (error) {
        console.error("[WSP] Error al enviar mensaje:", error.message);
        return false;
    }
}
