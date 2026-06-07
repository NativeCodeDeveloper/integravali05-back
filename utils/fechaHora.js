export const ZONA_HORARIA_NEGOCIO = "America/Santiago";

export function normalizarFechaCalendario(valor) {
    if (!valor) return "";

    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
        return new Intl.DateTimeFormat("en-CA", {
            timeZone: ZONA_HORARIA_NEGOCIO,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(valor);
    }

    const coincidencia = String(valor).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    return coincidencia ? `${coincidencia[1]}-${coincidencia[2]}-${coincidencia[3]}` : String(valor);
}

export function formatearFechaCalendario(valor, opciones = {}) {
    const fecha = normalizarFechaCalendario(valor);
    const coincidencia = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!coincidencia) return fecha;

    const [, anio, mes, dia] = coincidencia;
    const fechaUtc = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));

    return new Intl.DateTimeFormat("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
        ...opciones
    }).format(fechaUtc);
}

export function obtenerFechaHoraNegocio(fecha = new Date()) {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONA_HORARIA_NEGOCIO,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    }).formatToParts(fecha);

    const valores = Object.fromEntries(partes.map(({type, value}) => [type, value]));
    return `${valores.year}-${valores.month}-${valores.day} ${valores.hour}:${valores.minute}:${valores.second}`;
}
