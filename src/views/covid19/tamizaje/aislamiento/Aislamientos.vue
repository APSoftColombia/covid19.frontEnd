<template>
    <v-card flat>
        <v-toolbar dark color="deep-purple" dense>
            <v-icon left>mdi-door-closed-lock</v-icon>
            <v-toolbar-title>Ordenes de Aislamiento</v-toolbar-title>
            <v-spacer></v-spacer>
            <template v-if="puedeCrear">
                <v-tooltip top v-if="$vuetify.breakpoint.xsOnly">
                    <template v-slot:activator="{on}">
                        <v-btn dark @click="agregarAislamiento" icon color="deep-purple darken-3" v-on="on">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Agregar Aislamiento</span>
                </v-tooltip>
                <v-btn v-else dark @click="agregarAislamiento" color="deep-purple darken-3" class="mr-2">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar Aislamiento
                </v-btn>
            </template>
        </v-toolbar>
        <v-card-text class="text-center font-lg" v-if="tamizaje.aislamientos && !tamizaje.aislamientos.length">
            No registra ordenes de aislamiento
        </v-card-text>
        <v-row v-else>
            <v-col cols="12" class="pt-0 ma-0">
                <datos-aislamiento-tabla
                        @guardado="item => aislamientoGuardado(item)"
                        @editar="item => editarAislamiento(item)"
                        :aislamientos="tamizaje.aislamientos"
                        :nombre="tamizaje.nombre1 + ' ' + tamizaje.apellido1"
                ></datos-aislamiento-tabla>
            </v-col>
        </v-row>
        <registro-aislamiento
                v-if="permisos.aislamientoCrear"
                ref="registroAislamiento"
                @guardado="item => aislamientoGuardado(item)"
        >
        </registro-aislamiento>
    </v-card>
</template>

<script>
    import DatosAislamientoTabla from 'Views/covid19/tamizaje/aislamiento/DatosAislamientoTabla'
    import RegistroAislamiento from 'Views/covid19/tamizaje/aislamiento/RegistroAislamiento'
    export default {
        name: 'Aislamientos',
        components: {
            DatosAislamientoTabla,
            RegistroAislamiento
        },
        props: {
            tamizaje: {
                type: Object,
                default: null
            },
            editable: {
                type: Boolean,
                default: false
            }
        },
        data: () => ({
        }),
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
            puedeCrear () {
                return this && (this.permisos && this.permisos.aislamientoCrear) && this.editable && (this.tamizaje && this.tamizaje.aislamientos && (!this.tamizaje.aislamientos.length || (this.tamizaje.aislamientos.length && this.tamizaje.aislamientos[0].fecha_egreso)))
            }
        },
        watch: {
        },
        methods: {
            editarAislamiento(item) {
                this.$refs.registroAislamiento.open(item, {id: this.tamizaje.id, aislamientos: this.tamizaje.aislamientos})
            },
            agregarAislamiento () {
                this.$refs.registroAislamiento.open(null, {id: this.tamizaje.id, aislamientos: this.tamizaje.aislamientos})
            },
            aislamientoGuardado (item) {
                this.$emit('change', item)
            }
        }
    }
</script>

<style scoped>
.v-sheet {
    border-radius: 0 !important;
}
</style>