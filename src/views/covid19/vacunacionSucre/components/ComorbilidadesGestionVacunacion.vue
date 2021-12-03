<template>
    <v-col cols="12">
        <v-card outlined tile>
            <v-card-text>
                <c-check
                        v-model="lasComorbilidades"
                        label="COMORBILIDADES VACUNACIÓN"
                        :rules="sinComorbilidades ? '' : 'required'"
                        name="comorbilidades_vacunación"
                        :items="comorbilidadesVacunas"
                        item-text="descrip"
                        item-value="codigo"
                        :disabled="sinComorbilidades || disabled"
                >
                </c-check>
                <v-checkbox
                        class="mt-1 ml-2"
                        v-model="sinComorbilidades"
                        label="Ninguna de las anteriores"
                        hide-details
                        :disabled="disabled"
                ></v-checkbox>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'ComorbilidadesGestionVacunacion',
        props: {
            arrayComorbilidades: {
                type: [Array, String, Number, Boolean],
                default: () => []
            },
            disabled: {
                type: Boolean,
                required: false
            }
        },
        data: () => ({
            sinComorbilidades: false,
            lasComorbilidades: []
        }),
        computed: {
            ...mapGetters([
                'comorbilidadesVacunas'
            ])
        },
        watch: {
            'arrayComorbilidades': {
                handler (val) {
                    this.lasComorbilidades = val
                },
                immediate: true
            },
            'sinComorbilidades': {
                handler (val) {
                    if (val) {
                        this.$emit('changeComorbilidades', [])
                    }
                },
                immediate: false
            },
            'lasComorbilidades': {
                handler (val) {
                    this.$emit('changeComorbilidades', val)
                },
                immediate: false
            }
        }
    }
</script>

<style scoped>

</style>