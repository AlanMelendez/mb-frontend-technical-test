export interface GetSearchAutopartesRes {
    count:    number;
    next:     string;
    previous: null;
    results:  Result[];
}

export interface Result {
    id:                     number;
    titulo:                 string;
    precio:                 number | null;
    publicacion:            string[];
    marca_imagen:           string;
    nombre:                 string;
    marca:                  string;
    descripcion:            string;
    detalles:               null;
    peso:                   string;
    ancho:                  string;
    alto:                   string;
    largo:                  string;
    imagen:                 string;
    elementos_recomendados: number;
    fecha_registro:         Date;
    sku:                    string;
    activo:                 number;
    convertida:             number;
    unique_id:              string;
    partterminologyID:      string;
    has_image:              boolean;
    has_name:               boolean;
    marca_autoparte:        number;
    categoria:              number | null;
    subsubcategoria:        number | null;
}
