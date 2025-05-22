export interface GetMarcasVehiculosRes {
    success: number;
    content: Content[];
}

 interface Content {
    id:                number;
    descripcion_corta: string;
    nombre:            string;
    fecha_registro:    Date;
    activo:            number;
}
