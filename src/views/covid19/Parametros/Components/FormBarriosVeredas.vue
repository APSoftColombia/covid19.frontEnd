<template>
    <v-dialog v-model="dialog" width="720px" persistent>
        <v-card>
            <v-toolbar dark :color="barrioVereda && barrioVereda.id ? 'warning' : 'indigo'">
                <v-icon left>fas fa-{{barrioVereda && barrioVereda.id ? 'edit' : 'plus'}}</v-icon>
                <v-toolbar-title>{{barrioVereda && barrioVereda.id ? 'Editar Registro' :'Nuevo Registro' }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="mt-6">
                <ValidationObserver ref="formBarrioVereda" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <v-row>
                        <v-col cols="12">
                            <c-select-complete
                                v-model="barrioVereda.tipo"
                                label="Tipo"
                                name="tipo"
                                rules="required"
                                :items="['Barrio', 'Vereda']"
                            ></c-select-complete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" lg="6">
                            <c-texto
                                v-model="barrioVereda.codigo"
                                label="Codigo"
                                name="codigo"
                                upper-case
                            >
                            </c-texto>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" lg="6">
                            <c-texto
                                v-model="barrioVereda.nombre"
                                label="Nombre"
                                name="nombre"
                                rules="required"
                                upper-case
                            >
                            </c-texto>
                        </v-col>
                        <v-col class="pb-0" cols="12" sm="12">
                            <c-select-complete
                                    v-model="barrioVereda.departamento_id"
                                    label="Departamento"
                                    name="departamento"
                                    rules="required"
                                    :items="departamentos"
                                    item-text="nombre"
                                    item-value="id"
                            >
                            </c-select-complete>
                        </v-col>
                        <v-col class="pb-0" cols="12" sm="12">
                            <c-select-complete
                                    :disabled="!barrioVereda.departamento_id"
                                    v-model="barrioVereda.municipio_id"
                                    label="Municipio"
                                    name="municipio"
                                    rules="required"
                                    :items="departamentos.length && barrioVereda.departamento_id ? departamentos.find(x => x.id === barrioVereda.departamento_id).municipios : []"
                                    item-text="nombre"
                                    item-value="id"
                            >
                            </c-select-complete>
                        </v-col>
                    </v-row>
                </ValidationObserver>
                <v-card-actions>
                    <v-btn @click="close">
                        <v-icon>mdi-close</v-icon>
                        <span>Cerrar</span>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="saveBarrioVereda" class="white--text" :color="barrioVereda && barrioVereda.id ? 'warning': 'indigo'">
                        <v-icon left>fas fa-save</v-icon>
                        <span>Guardar</span>
                    </v-btn>
                </v-card-actions>
            </v-card-text>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "FormBarriosVeredas",
        data: () => ({
            dialog: false,
            barrioVereda: null,
            loading: false,
            barrioVeredaModel: {
                codigo: null,
                nombre: null,
                tipo: null,
                nombre_municipio: null,
                departamento_id: null,
            }
        }),
        computed: {
            ...mapGetters([
                'departamentos',
            ]),
        },
        methods: {
            open(barrio_vereda = null){
                if(barrio_vereda){
                    this.barrioVereda = this.clone(barrio_vereda)
                }else{
                    this.barrioVereda = this.barrioVeredaModel
                }
                this.dialog = true
            },
            close(){
                this.dialog = false
            },
            saveBarrioVereda(){
                this.$refs.formBarrioVereda.validate().then(result => {
                    if(result){
                        this.loading = true
                        let request = !this.barrioVereda.id
                            ? this.axios.post('barrios-veredas', this.barrioVereda)
                            : this.axios.put(`barrios-veredas/${this.barrioVereda.id}`, this.barrioVereda)
                        request.then(response => {
                            this.loading = false
                            this.$store.commit('snackbar', {
                                color: 'success',
                                message: response.data.message
                            })
                            this.close()
                            this.$emit('actualizarTabla')
                        }).catch(error => {
                            this.loading = false
                            this.$store.commit('snackbar', {
                                color: 'error',
                                message: ` al ${this.barrioVereda.id ? 'Actualizar' : 'Crear'} ${this.barrioVereda.tipo === 'Barrio' ? 'Barrio' : 'Vereda'} `,
                                error: error
                            })
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>