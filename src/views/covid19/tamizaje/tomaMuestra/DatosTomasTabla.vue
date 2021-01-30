<template>
    <div>
        <v-simple-table dense class="tablaaislamientos" fixed-header>
            <template v-slot:default>
                <thead>
                <tr>
                    <th>No.</th>
                    <th>Asignación</th>
                    <th>Institución que realiza la toma</th>
                    <th>Usuario Registra Toma</th>
                    <th>Fecha Toma</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <template v-for="(toma, tomaIndex) in tomas">
                    <dato-muestra-t-r @marcarFecha="val => marcarFecha(val)" :toma="toma" :numero="tomas.length - tomaIndex" :key="`toma${tomaIndex}`" :puede-crear="puedeCrear"/>
                </template>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
    import DatoMuestraTR from 'Views/covid19/tamizaje/tomaMuestra/DatoMuestraTR'
    export default {
        name: 'DatosAislamientoTabla',
        props: {
          tomas: {
              type: Array,
              default: () => []
          },
          puedeCrear: {
            type: Boolean,
            default: false
          }
        },
        components: {
          DatoMuestraTR
        },
        methods: {
          marcarFecha (dato) {
                this.$emit('marcarFecha', dato)
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