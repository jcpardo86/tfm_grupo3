export interface IDebt {
    idDeuda: number;
    idGrupo: number,
    nombre_grupo: string, 
    idUsuario: number,
    nombre_usuario: string,
    receptor: number,
    nombre_receptor: string,
    importe: number,
    is_pagada: number,
}
