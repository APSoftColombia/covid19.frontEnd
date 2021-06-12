<template>
    <div>
        <v-simple-table dense class="tablaaislamientos" fixed-header>
            <template v-slot:default>
                <thead>
                <tr>
                    <th>No.</th>
                    <th>Lugar</th>
                    <th>Ambito</th>
                    <th>Fecha</th>
                    <th>Soportes</th>
                    <th>Proceso</th>
                    <th>Ordenado Por</th>
                    <th>Usuario</th>
                    <th>Detalle</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="(aislamiento, aislamientoIndex) in aislamientos">
                    <dato-aislamiento-t-r
                        @verdetalle="val => verDetalle(val, aislamientoIndex)"
                        @editar="val => $emit('editar', val)"
                        :aislamiento="aislamiento"
                        :numero="aislamientos.length - aislamientoIndex"
                        :key="`aislamiento${aislamientoIndex}`"
                        :nombre="nombre"
                    />
                </template>
                </tbody>
            </template>
        </v-simple-table>
        <detalle-aislamiento
            :aislamiento="aislamientoSeleccionado"
            :index="indexAislamientoSeleccionado"
            @guardado="val => datoActualizado(val)" ref="detalleAislamiento"
        />
    </div>
</template>

<script>
    import DatoAislamientoTR from 'Views/covid19/tamizaje/aislamiento/DatoAislamientoTR'
    import DetalleAislamiento from 'Views/covid19/tamizaje/aislamiento/DetalleAislamiento'
    export default {
        name: 'DatosAislamientoTabla',
        props: {
            aislamientos: {
              type: Array,
              default: () => []
          },
          nombre: {
                type: String,
                defaulut: null
          }
        },
        components: {
            DatoAislamientoTR,
            DetalleAislamiento
        },
        watch: {
            aislamientos: {
                handler () {
                    this.verDetalle(this.aislamientoSeleccionado)
                },
                immediate: false
            }
        },
        data: () => ({
            aislamientoSeleccionado: null,
            indexAislamientoSeleccionado: null
        }),
        computed: {
            ultimoSeguimiento () {
              return this && this.aislamiento && this.aislamiento.seguimientos && this.aislamiento.seguimientos.length ? this.aislamiento.seguimientos[0] : null
            }
        },
        methods: {
            datoActualizado (dato) {
                this.$emit('guardado', dato)
            },
            verDetalle (aislamiento, index) {
                this.aislamientoSeleccionado = aislamiento ? this.aislamientos.find(x => x.id === aislamiento.id) : null
                this.indexAislamientoSeleccionado = index
                if (this.aislamientoSeleccionado) {
                    this.$refs.detalleAislamiento.open()
                }
            }
        }
    }
</script>

<style scoped>
    .tablaaislamientos .v-data-table table thead tr td, .v-data-table table thead tr th, .v-data-table table tbody tr td, .v-data-table table tbody tr th, .v-data-table table tfoot tr td, .v-data-table table tfoot tr t {
        height: 2rem !important;
    }

    .tablaaislamientos .v-data-table td, .v-data-table th {
        padding: 0 8px !important;
    }
</style>