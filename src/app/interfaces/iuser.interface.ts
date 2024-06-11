export interface IUser {
    idUsuario?: number,
    nombre: string,
    apellidos: string,
    email: string,
    password: string,
    imagen?: string
    reset_password_token?: string,
    porcentaje?: number
}
