import DataBase from "../config/Database.js";


export default class Pacientes {
    constructor(
        id_paciente,
        estado_paciente,
        nombre,
        apellido,
        rut,
        nacimiento,
        sexo,
        prevision_id,
        telefono,
        correo,
        direccion,
        pais,
        observacion1,
        observacion2,
        observacion3,
        apoderado,
        apoderado_rut,
        medicamentosUsados,
        habitos,
        comentariosAdicionales
    ) {
        this.id_paciente = id_paciente;
        this.estado_paciente = estado_paciente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rut = rut;
        this.nacimiento = nacimiento;
        this.sexo = sexo;
        this.prevision_id = prevision_id;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
        this.pais = pais;
        this.observacion1 = observacion1;
        this.observacion2 = observacion2;
        this.observacion3 = observacion3;
        this.apoderado = apoderado;
        this.apoderado_rut = apoderado_rut;
        this.medicamentosUsados = medicamentosUsados;
        this.habitos = habitos;
        this.comentariosAdicionales = comentariosAdicionales;
    }


    // SELECCION DE TODOS LOS PACIENTES DE LA BASE DE DATOS
    async selectPaciente(){
        const conexion = DataBase.getInstance();
        const query = 'SELECT * FROM pacienteDatos WHERE estado_paciente <> 0';
        try {
            const resultado = await conexion.ejecutarQuery(query);
            return resultado;
        } catch (error) {
            throw new Error('Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')

        }
    }


//SELECCION DE PACIENTE ESPECIFICO POR id?paciente
    async selectPacienteEspecifico(id_paciente){
        const conexion = DataBase.getInstance();
        const query = 'SELECT * FROM pacienteDatos WHERE id_paciente = ? and estado_paciente <> 0';
        const param = [id_paciente]
        try {
            const resultado = await conexion.ejecutarQuery(query, param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('No se puede seleccionar paciente especifico / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }


    //SELECCION DE PACIENTE POR -----> RUT %PARECIDO% <------
    async PacienteParecidoRut(rut){
        const conexion = DataBase.getInstance();
        const query = 'SELECT * FROM pacienteDatos WHERE rut LIKE ?';
        const param = [`%${rut}%`]
        try {
            const resultado = await conexion.ejecutarQuery(query, param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('No se puede seleccionar paciente / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }





    //SELECCION DE PACIENTE POR -----> NOMBRE %PARECIDO% <------
    async PacienteParecidoNombre(nombre){
        const conexion = DataBase.getInstance();
        const query = 'SELECT * FROM pacienteDatos WHERE nombre LIKE ?';
        const param = [`%${nombre}%`]
        try {
            const resultado = await conexion.ejecutarQuery(query, param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('No se puede seleccionar paciente / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }





// ACTUALIZACION DE PACIENTE POR ID
    async updatePaciente(nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,observacion1,observacion2,observacion3,apoderado,apoderado_rut,medicamentosUsados,habitos,comentariosAdicionales,id_paciente){
        const conexion = DataBase.getInstance();
        const query = 'UPDATE pacienteDatos SET nombre= ? ,apellido = ? , rut = ?, nacimiento = ?, sexo = ?, prevision_id = ?, telefono = ?, correo = ? , direccion = ?, pais = ?, observacion1 = ?, observacion2 = ?, observacion3 = ?, apoderado = ?, apoderado_rut = ?, medicamentosUsados = ?, habitos = ?, comentariosAdicionales = ? WHERE id_paciente = ?';
        const param = [nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,observacion1,observacion2,observacion3,apoderado,apoderado_rut,medicamentosUsados,habitos,comentariosAdicionales,id_paciente ];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo actualizar paciente  / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }



// INSERCION DE NUEVO PACIENTE EN LA BASE DE DATOS
    async insertPaciente(nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,observacion1,observacion2,observacion3,apoderado,apoderado_rut,medicamentosUsados,habitos,comentariosAdicionales){
        try {
        const conexion = DataBase.getInstance();

        const consultaValidacionRut = `SELECT 1 FROM pacienteDatos WHERE rut = ? AND estado_paciente <> 0`;
        const paramsRut = [rut];

        const resultadoValidacion =  await conexion.ejecutarQuery(consultaValidacionRut,paramsRut)

            if (resultadoValidacion.length > 0) {
                return {duplicado: true}

            }else{
                const query = 'INSERT INTO pacienteDatos (nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,observacion1,observacion2,observacion3,apoderado,apoderado_rut,medicamentosUsados,habitos,comentariosAdicionales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                const param = [
                    nombre,
                    apellido,
                    rut,
                    nacimiento,
                    sexo,
                    prevision_id,
                    telefono,
                    correo,
                    direccion,
                    pais,
                    observacion1,
                    observacion2,
                    observacion3,
                    apoderado,
                    apoderado_rut,
                    medicamentosUsados,
                    habitos,
                    comentariosAdicionales];

                const resultado = await conexion.ejecutarQuery(query,param);
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo ingresar paciente nuevo / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }



    // ELIMINACION LOGICA DE PACIENTE DE LA BASE DE DATOS
    async deletePaciente(id_paciente){
        const conexion = DataBase.getInstance();
        const query = 'UPDATE pacienteDatos SET estado_paciente = 0 WHERE id_paciente = ?';
        const param = [id_paciente];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);

            if (resultado) {
                return resultado;
            } else {
                return resultado;

            }
        } catch (error) {
            throw new Error('NO se logo Eliminar paciente  / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')

        }
    }







// INSERCION DE NUEVO PACIENTE EN LA BASE DE DATOS
    async insertPacientemp(nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,observacion1 = null,observacion2 = null,observacion3 = null,apoderado = null,apoderado_rut = null,medicamentosUsados = null,habitos = null,comentariosAdicionales = null){
        const conexion = DataBase.getInstance();

        try {
            const queryVerificadora = 'SELECT * FROM pacienteDatos WHERE rut = ?';
            const paramVerificadora = [rut];

            const respuestaConsultaVerificacion = await conexion.ejecutarQuery(queryVerificadora, paramVerificadora);

            if (respuestaConsultaVerificacion.length > 0) {
                // Ya existe un paciente con ese preference_id
                return { duplicado: true };
            }else{

                const query = 'INSERT INTO pacienteDatos (nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,observacion1,observacion2,observacion3,apoderado,apoderado_rut,medicamentosUsados,habitos,comentariosAdicionales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                const param = [nombre, apellido, rut, nacimiento, sexo, prevision_id, telefono, correo, direccion, pais, observacion1, observacion2, observacion3, apoderado, apoderado_rut, medicamentosUsados, habitos, comentariosAdicionales];
                const resultado = await conexion.ejecutarQuery(query,param);
                if (resultado){
                    return resultado;
                }
            }

        } catch (error) {
            throw new Error('NO se logo ingresar paciente nuevo / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }




}
