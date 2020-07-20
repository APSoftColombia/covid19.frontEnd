<template>
    <v-card flat>
        <v-toolbar dark color="warning" dense>
            <v-icon left>fas fa-people-arrows</v-icon>
            <v-toolbar-title>Nexos</v-toolbar-title>
            <template v-if="permisos.seguimientoCrear && editable">
                <v-spacer></v-spacer>
                <v-btn dark @click="agregarNexo" color="warning darken-3">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar nexo
                </v-btn>
            </template>
        </v-toolbar>
        <v-card-text class="text-center font-lg" v-if="!tamizaje.nexos.length">
            No registra nexos
        </v-card-text>
        <v-row v-else>
            <v-col cols="12" class="pt-0">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-left">Nexo</th>
                            <th class="text-left">Persona</th>
                            <th class="text-left">Ubicación</th>
                            <th class="text-left">Observaciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, nexoIndex) in tamizaje.nexos" :key="`nexo${nexoIndex}`">
                            <td>
                                <v-list-item class="pa-0">
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title class="body-2">Id: {{item.id}}</v-list-item-title>
                                        <v-list-item-subtitle class="title caption">
                                            {{moment(item.created_at).format('DD/MM/YYYY')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </td>
                            <td>
                                <v-list-item class="pa-0">
                                    <v-list-item-avatar>
                                        <v-icon large>{{item.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title class="body-2">{{item.nombres}}</v-list-item-title>
                                        <v-list-item-subtitle class="title caption">
                                            {{[item.edad ? ('Edad: ' + item.edad) : '', item.celular ? ('Cel: ' + item.celular) : ''].filter(x => x).join(', ')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </td>
                            <td>
                                <v-list-item class="pa-0">
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title class="body-2">{{municipiosTotal && municipiosTotal.length && item.municipio_id && municipiosTotal.find(x => x.id === item.municipio_id) ?  `${municipiosTotal.find(x => x.id === item.municipio_id).nombre}, ${municipiosTotal.find(x => x.id === item.municipio_id).departamento.nombre}` : ''}}</v-list-item-title>
                                        <v-list-item-subtitle class="title caption">
                                            {{item.direccion}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </td>
                            <td>{{item.observaciones}}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <registro-reporte-comunitario
                ref="registroNexo"
                @guardado="val => nexoGuardado(val)"
        ></registro-reporte-comunitario>
    </v-card>
</template>

<script>
    import {mapGetters} from "vuex";

    const RegistroReporteComunitario = () => import('Views/covid19/reporteComunitario/RegistroReporteComunitario')
    export default {
        name: 'Nexos',
        components: {
            RegistroReporteComunitario
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
        computed: {
            ...mapGetters([
                'municipiosTotal'
            ]),
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            }
        },
        methods: {
            agregarNexo () {
                this.$refs.registroNexo.open(null, this.tamizaje)
            },
            nexoGuardado (item) {
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