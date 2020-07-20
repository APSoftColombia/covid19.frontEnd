// char data
export const anchosPantallaPreguntas = [
    {
        id: 1,
        nombre: '1/3 de pantalla'
    },
    {
        id: 2,
        nombre: '1/2 de pantalla'
    },
    {
        id: 3,
        nombre: 'Ancho completo'
    }
]
export const tiposPreguntasPadre = [1, 2, 4, 5, 6, 14, 15,16]
export const operadores = [
    {
        value: '=',
        text: 'Igual que',
        tipoAplica: [1, 2, 4, 5, 6, 14, 15, 16]
    },
    {
        value: '>',
        text: 'Mayor que',
        tipoAplica: [4, 5, 6, 14, 16]
    },
    {
        value: '<',
        text: 'Menor que',
        tipoAplica: [4, 5, 6, 14, 16]
    },
    {
        value: '!=',
        text: 'Diferente que',
        tipoAplica: [2, 4, 5, 6, 14, 15, 16]
    },
    {
        value: '>=',
        text: 'Mayor o igual que',
        tipoAplica: [4, 5, 6, 14, 16]
    },
    {
        value: '<=',
        text: 'Menor o igual que',
        tipoAplica: [4, 5, 6, 14, 16]
    }
]

// Constructor de direcciones
export const nombresCalles = [
    { value: 'CALLE', text: 'CALLE' },
    { value: 'CARRERA', text: 'CARRERA' },
    { value: 'AVENIDA', text: 'AVENIDA' },
    { value: 'DIAGONAL', text: 'DIAGONAL' },
    { value: 'TRANSVERSAL', text: 'TRANSVERSAL' },
    { value: 'KILÓMETRO', text: 'KILÓMETRO' },
    { value: 'VÍA', text: 'VÍA' },
    { value: 'TIENDA', text: 'TIENDA' },
    { value: 'APARTAMENTO', text: 'APARTAMENTO' },
    { value: 'AGRUPACIÓN', text: 'AGRUPACIÓN' },
    { value: 'BARRIO', text: 'BARRIO' },
    { value: 'BLOQUE', text: 'BLOQUE' },
    { value: 'BODEGA', text: 'BODEGA' },
    { value: 'CÉLULA', text: 'CÉLULA' },
    { value: 'CASA', text: 'CASA' },
    { value: 'CIUDADELA', text: 'CIUDADELA' },
    { value: 'CONJUNTO', text: 'CONJUNTO' },
    { value: 'CONSULTORIO', text: 'CONSULTORIO' },
    { value: 'DEPÓSITO', text: 'DEPÓSITO' },
    { value: 'EDIFICIO', text: 'EDIFICIO' },
    { value: 'ESQUINA', text: 'ESQUINA' },
    { value: 'ETAPA', text: 'ETAPA' },
    { value: 'GARAJE', text: 'GARAJE' },
    { value: 'INTERIOR', text: 'INTERIOR' },
    { value: 'LOCAL', text: 'LOCAL' },
    { value: 'LOTE', text: 'LOTE' },
    { value: 'MANZANA', text: 'MANZANA' },
    { value: 'MEZANINE', text: 'MEZANINE' },
    { value: 'MÓDULO', text: 'MÓDULO' },
    { value: 'OFICINA', text: 'OFICINA' },
    { value: 'PASEO', text: 'PASEO' },
    { value: 'PARCELA', text: 'PARCELA' },
    { value: 'PENTHOUSE', text: 'PENTHOUSE' },
    { value: 'PISO', text: 'PISO' },
    { value: 'PREDIO', text: 'PREDIO' },
    { value: 'SALÓN', text: 'SALÓN COMUNAL' },
    { value: 'SECTOR', text: 'SECTOR' },
    { value: 'SOLAR', text: 'SOLAR' },
    { value: 'SEMI', text: 'SEMI SÓTANO' },
    { value: 'SUPER', text: 'SUPER MANZANA' },
    { value: 'TORRE', text: 'TORRE' },
    { value: 'UNIDAD', text: 'UNIDAD' },
    { value: 'UNIDAD', text: 'UNIDAD RESIDENCIAL' },
    { value: 'URBANIZACIÓN', text: 'URBANIZACIÓN' },
    { value: 'ZONA', text: 'ZONA' }
]

export const cardinales = [
    { value: 'NORTE', text: 'NORTE' },
    { value: 'ESTE', text: 'ESTE' },
    { value: 'OESTE', text: 'OESTE' },
    { value: 'SUR', text: 'SUR' }
]
export const adicionalesRural = [
    { value: 'CAMINO', text: 'CAMINO' },
    { value: 'CARRETERA', text: 'CARRETERA' },
    { value: 'CASA', text: 'CASA' },
    { value: 'ENTRADA', text: 'ENTRADA' },
    { value: 'FINCA', text: 'FINCA' },
    { value: 'KILÓMETRO', text: 'KILÓMETRO' },
    { value: 'LOTE', text: 'LOTE' },
    { value: 'MANZANA', text: 'MANZANA' },
    { value: 'PASEO', text: 'PASEO' },
    { value: 'PUENTE', text: 'PUENTE' },
    { value: 'PREDIO', text: 'PREDIO' },
    { value: 'SECTOR', text: 'SECTOR' },
    { value: 'SOLAR', text: 'SOLAR' },
    { value: 'VEREDA', text: 'VEREDA' },
    { value: 'ZONA', text: 'ZONA' }
]

export const adicionalesUrbana = [
    { value: 'KILÓMETRO', text: 'KILÓMETRO' },
    { value: 'VÍA', text: 'VÍA' },
    { value: 'TIENDA', text: 'TIENDA' },
    { value: 'APARTAMENTO', text: 'APARTAMENTO' },
    { value: 'AGRUPACIÓN', text: 'AGRUPACIÓN' },
    { value: 'BARRIO', text: 'BARRIO' },
    { value: 'BLOQUE', text: 'BLOQUE' },
    { value: 'BODEGA', text: 'BODEGA' },
    { value: 'CÉLULA', text: 'CÉLULA' },
    { value: 'CASA', text: 'CASA' },
    { value: 'CIUDADELA', text: 'CIUDADELA' },
    { value: 'CONJUNTO', text: 'CONJUNTO' },
    { value: 'CONSULTORIO', text: 'CONSULTORIO' },
    { value: 'DEPÓSITO', text: 'DEPÓSITO' },
    { value: 'EDIFICIO', text: 'EDIFICIO' },
    { value: 'ESQUINA', text: 'ESQUINA' },
    { value: 'ETAPA', text: 'ETAPA' },
    { value: 'GARAJE', text: 'GARAJE' },
    { value: 'INTERIOR', text: 'INTERIOR' },
    { value: 'LOCAL', text: 'LOCAL' },
    { value: 'LOTE', text: 'LOTE' },
    { value: 'MANZANA', text: 'MANZANA' },
    { value: 'MEZANINE', text: 'MEZANINE' },
    { value: 'MÓDULO', text: 'MÓDULO' },
    { value: 'OFICINA', text: 'OFICINA' },
    { value: 'PASEO', text: 'PASEO' },
    { value: 'PARCELA', text: 'PARCELA' },
    { value: 'PENTHOUSE', text: 'PENTHOUSE' },
    { value: 'PISO', text: 'PISO' },
    { value: 'PREDIO', text: 'PREDIO' },
    { value: 'SALÓN', text: 'SALÓN COMUNAL' },
    { value: 'SECTOR', text: 'SECTOR' },
    { value: 'SOLAR', text: 'SOLAR' },
    { value: 'SEMI', text: 'SEMI SÓTANO' },
    { value: 'SUPER', text: 'SUPER MANZANA' },
    { value: 'TORRE', text: 'TORRE' },
    { value: 'UNIDAD', text: 'UNIDAD' },
    { value: 'UNIDAD', text: 'UNIDAD RESIDENCIAL' },
    { value: 'URBANIZACIÓN', text: 'URBANIZACIÓN' },
    { value: 'ZONA', text: 'ZONA' }
]

export const ABCDario = [
    { value: 'A', text: 'A' },
    { value: 'B', text: 'B' },
    { value: 'C', text: 'C' },
    { value: 'D', text: 'D' },
    { value: 'E', text: 'E' },
    { value: 'F', text: 'F' },
    { value: 'G', text: 'G' },
    { value: 'H', text: 'H' },
    { value: 'I', text: 'I' },
    { value: 'J', text: 'J' },
    { value: 'K', text: 'K' },
    { value: 'L', text: 'L' },
    { value: 'M', text: 'M' },
    { value: 'N', text: 'N' },
    { value: 'O', text: 'O' },
    { value: 'P', text: 'P' },
    { value: 'Q', text: 'Q' },
    { value: 'R', text: 'R' },
    { value: 'S', text: 'S' },
    { value: 'T', text: 'T' },
    { value: 'U', text: 'U' },
    { value: 'V', text: 'V' },
    { value: 'X', text: 'X' },
    { value: 'Y', text: 'Y' },
    { value: 'Z', text: 'Z' }
]