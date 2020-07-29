<template>
    <v-dialog v-model="dialog" width="720px" persistent>
        <template v-slot:activator="{ on }">
            <v-btn color="warning" v-if="laboratorio && laboratorio.id" x-small v-on="on" icon @click="dialog = true">
                <v-icon>fas fa-edit</v-icon>
            </v-btn>
            <v-btn v-else class="primary" @click="dialog = true" v-on="on">
                <v-icon left>fas fa-plus</v-icon>
                <span>Nuevo</span>
            </v-btn>
        </template>
        <v-card>
            <v-toolbar dark :color="laboratorio && laboratorio.id ? 'warning' : 'indigo'">
                <v-icon left>fas fa-{{laboratorio && laboratorio.id ? 'edit' : 'plus'}}</v-icon>
                <v-toolbar-title>{{ laboratorio && laboratorio.id ? 'Editar' : 'Crear' }} Laboratorio</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container>
                <ValidationObserver ref="formLab" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <v-row>
                        <v-col cols="12">
                            <c-texto
                                v-model="laboratorioD.laboratorio"
                                label="Nombre"
                                name="nombre"
                                rules="required"
                                upper-case
                            >
                            </c-texto>
                        </v-col>
                    </v-row>
                </ValidationObserver>
            </v-container>
            <v-card-actions>
                <v-btn @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                    <span>Cerrar</span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="save" class="white--text" :color="laboratorio && laboratorio.id ? 'warning' : 'indigo'">
                    <v-icon left>fas fa-save</v-icon>
                    <span>Guardar</span>
                </v-btn>
            </v-card-actions>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "FormLaboratorio",
        props: {
            laboratorio: {
                type: Object,
                default: null
            }
        },
        data: () => ({
            dialog: false,
            loading: false,
            laboratorioD: null,
            laboratorioM: {
                id: null,
                laboratorio: null
            }
        }),
        watch: {
            laboratorio: {
                handler(val){
                    val && this.assignData()
                },
                inmediate: true
            }
        },
        methods: {
            assignData(){
                if(this.laboratorio){
                    this.laboratorioD = {...this.laboratorio}
                }else{
                    this.laboratorioD = this.laboratorioM
                }
            },
            save(){
                this.$refs.formLab.validate().then(result => {
                    if(result){
                        this.loading = true
                        let request = !this.laboratorioD.id
                            ? this.axios.post('laboratorios', this.laboratorioD)
                            : this.axios.put(`laboratorios/${this.laboratorioD.id}`, this.laboratorioD)
                        request.then(response => {
                            this.$store.commit('snackbar', {color: 'success', message: response.data.message})
                            this.dialog = false
                            this.loading = false
                            this.$emit('reloadTable')
                        }).catch(error => {
                            this.loading = false
                            this.$store.commit('snackbar', {color: 'success', message: ` al ${this.laboratorioD.id ? 'actualizar' : 'crear'} laboratorio`, error: error})
                        })
                    }
                })
            }
        },
        created() {
            this.assignData()
        }
    }
</script>

<style scoped>

</style>