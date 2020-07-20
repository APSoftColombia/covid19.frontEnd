<template>
    <v-dialog v-model="dialog" persistent max-width="920">
        <v-card>
            <ValidationObserver ref="formPosiblesRespuestas" v-slot="{ invalid, validated, passes, validate }" tag="form" autocomplete="off" @submit.prevent="submitPosiblesRespuestas">
                <v-toolbar class="elevation-0">
                    <v-list-item class="pa-0">
                        <v-list-item-avatar color="indigo" class="mr-2">
                            <v-icon class="white--text">fas fa-database</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>Fuente de datos</v-list-item-title>
                            <v-list-item-subtitle class="text-truncate">{{fuenteDatos && fuenteDatos.id ? 'Edición' : 'Nueva'}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn text icon @click="dialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-toolbar>
                <v-divider class="mt-0"></v-divider>
                <v-card-text>
                    <ValidationObserver ref="formFuenteDatos" v-slot="{ invalid, validated, passes, validate }" tag="form" autocomplete="off">
                        <v-row align="center" class="px-3">
                            <v-col>
                                <ValidationProvider name="primer nombre" rules="required" v-slot="{ errors, valid }">
                                    <v-text-field
                                            v-model="fuenteDatos.nombre"
                                            label="Primer Nombre"
                                            :error-messages="errors"
                                            outlined
                                            dense
                                    ></v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-switch
                                    class="mt-0 mb-2"
                                    v-model="fuenteDatos.habilitado"
                                    label="Habilitado"
                                    color="green"
                                    :true-value="1"
                                    :false-value="0"
                            ></v-switch>
                        </v-row>

                        <v-row align="center" class="px-3">
                            <v-col>
                                <v-text-field
                                        v-model="textOpcion"
                                        label="Texto de opcion"
                                        class="mr-2"
                                        hide-details
                                        outlined
                                        dense
                                ></v-text-field>
                            </v-col>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" color="primary" @click="assign">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Crear opción</span>
                            </v-tooltip>
                        </v-row>
                    </ValidationObserver>
                    <v-simple-table
                            :dense="true"
                            fixed-header
                    >
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th class="text-left">Nombre</th>
                                <th class="text-center"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, indexItem) in fuenteDatos.opciones" :key="indexItem">
                                <td>{{ item.nombre }}</td>
                                <th class="text-center">
                                    <v-btn text icon color="error" @click.stop="fuenteDatos.opciones.splice(indexItem, 1)">
                                        <v-icon>mdi-trash-can</v-icon>
                                    </v-btn>
                                </th>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="dialog = false">
                        <v-icon left>mdi-close</v-icon>
                        Cerrar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" color="primary">
                        <v-icon left>fas fa-save</v-icon>
                        Guardar
                    </v-btn>
                </v-card-actions>
            </ValidationObserver>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'PosiblesRespuestas',
        props: {
            pregunta: {
                type: Object,
                default: null
            }
        },
        data: () => ({
            textOpcion: null,
            fuenteDatos: null,
            makeFuenteDatos: {
                id: null,
                nombre: null,
                endpoint: null,
                tabla: null,
                habilitado: 1,
                opciones: []
            },
            dialog: false
        }),
        computed: {
        },
        watch: {
        },
        methods: {
            open (fuente = null) {
                this.fuenteDatos = fuente ? fuente : this.clone(this.makeFuenteDatos)
                this.dialog = true
            },
            assign () {
                if (this.textOpcion) {
                    this.fuenteDatos.opciones.push(
                        {id: null, fuente_dato_id: this.fuenteDatos.id, nombre: this.textOpcion}
                    )
                    this.textOpcion = null
                }
            },
            submitPosiblesRespuestas () {
                this.$refs.formFuenteDatos.validate().then(result => {
                    if (result) {
                        if (this.fuenteDatos.opciones.length) {
                            this.dialog = true
                            this.$store.dispatch('guardarFuenteDatos', this.fuenteDatos).then(() => {
                                this.loading = false
                            })
                        } else {
                            this.$store.commit('snackbar', {color: 'warning', message: `No hay registros de opciones para ésta fuente de datos.`})
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>