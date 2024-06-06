export interface IDebt {
    idGrupo: number, 
    idPagador: number,
    namePagador: string,
    idReceptor: number,
    nameReceptor: string,
    importe: number,
    liquidado?: string,
}
