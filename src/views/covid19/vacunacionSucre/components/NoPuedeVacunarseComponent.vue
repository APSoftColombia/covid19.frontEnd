<template>
    <v-col cols="12">
        <v-card outlined tile>
            <v-card-text>
                <c-check
                        v-model="lasOpciones"
                        label="Motivo no puede vacunarse"
                        :rules="'required'"
                        name="motivos_no_puede_vacunarse"
                        :items="dosisVacunas.motivosNoPuedeVacunarse"
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
        name: 'NoPuedeVacunarseComponent',
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
            lasOpciones: []
        }),
        computed: {
            ...mapGetters([
                'dosisVacunas'
            ])
        },
        watch: {
            'arrayOpciones': {
                handler (val) {
                    this.lasOpciones = val
                },
                immediate: true
            },
            'lasOpciones': {
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