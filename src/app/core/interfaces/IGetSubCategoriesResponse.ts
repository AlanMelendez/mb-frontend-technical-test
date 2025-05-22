export interface GetSubCategoriesRes {
    success: number;
    content: Content[];
    mensaje: string;
}

export interface Content {
    id:             number;
    nombre:         string;
    nombre_spanish: string;
    imagen:         null;
    activo:         number;
    CategoryID:     number;
    SubcategoryID:  number;
}
