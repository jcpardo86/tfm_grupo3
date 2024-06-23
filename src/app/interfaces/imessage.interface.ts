export interface IMessage {
    idMensaje? : number;
    idGrupo?: number;
    idUsuario: number;
    nombre_usuario?: string;
    fecha_hora: string;
    texto: string
}
