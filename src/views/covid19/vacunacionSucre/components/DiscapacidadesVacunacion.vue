<template>
    <v-col cols="12">
        <v-card outlined tile>
            <v-card-text>
                <c-check
                        v-model="lasDiscapacidad"
                        label="Seleccione la(s) discapacidad(es)"
                        :rules="'required'"
                        name="Discapacidad_vacunacion"
                        :items="discapacidadesVacunacion"
                        item-text="descripcion"
                        item-value="id"
                        :disabled="disabled"
                >
                </c-check>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'DiscapacidadesVacunacion',
        props: {
            arrayOpciones: {
                type: [Array, String, Number, Boolean],
                default: () => []
            },
            disabled: {
                type: Boolean,
                required: false
            }
        },
        data: () => ({
            lasDiscapacidad: []
        }),
        computed: {
            ...mapGetters([
                'discapacidadesVacunacion'
            ])
        },
        watch: {
            'arrayOpciones': {
                handler (val) {
                    this.lasDiscapacidad = val
                },
                immediate: true
            },
            'lasDiscapacidad': {
                handler (val) {
                    this.$emit('changeOpciones', val)
                },
                immediate: false
            }
        }
    }
</script>

<style scoped>

</style>