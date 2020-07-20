<template>
    <v-dialog v-model="dialog" persistent max-width="720">
        <template v-slot:activator="{ on }">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn fab color="primary" small dark v-on="on" @click="dialog = true">
                        <v-icon>mdi-{{encuestado ? 'pencil' : 'plus'}}</v-icon>
                    </v-btn>
                </template>
                <span>{{encuestado ? 'Editar' : 'Agregar'}} Datos Informante</span>
            </v-tooltip>
        </template>
        <v-card>
            <v-toolbar dark color="warning">
                <v-icon left>fas fa-user</v-icon>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="title">Registro de informante</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <ValidationObserver ref="formEncuestado" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <form-persona v-model="persona" tipo="encuestado"></form-persona>
                </ValidationObserver>
                <v-card-actions>
                    <v-btn @click.stop="close">
                        <v-icon>mdi-close</v-icon>
                        Cerrar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.stop="guardar">
                        <v-icon left>fas fa-save</v-icon>
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import FormPersona from 'Views/covid19/tamizaje/FormPersona'
    import {mapGetters} from "vuex";
    export default {
        name: 'RegistroEncuestado',
        props: {
            encuestado: {
                type: Object,
                default: null
            }
        },
        components: {
            FormPersona
        },
        computed: {
            ...mapGetters([
                'modelPersona'
            ])
        },
        watch: {
            encuestado: {
                handler (val) {
                    val && this.assign()
                },
                immediate: false
            }
        },
        data: () => ({
            dialog: false,
            persona: null
        }),
        created() {
            this.persona = this.clone(this.modelPersona)
        },
        methods: {
            assign () {
              this.persona = this.clone(this.encuestado)
            },
            close () {
                this.dialog = false
            },
            guardar () {
                this.$refs.formEncuestado.validate().then(result => {
                    if (result) {
                        this.$emit('guardar', this.persona)
                        this.close()
                    } else {
                        this.$store.commit('snackbar', {color: 'warning', message: `Hay datos requeridos por diligenciar.`})
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>