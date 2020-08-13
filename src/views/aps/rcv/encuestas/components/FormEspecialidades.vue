<template>
    <v-row>
        <v-col class="pb-0" cols="12">
            <v-card outlined tile>
                <v-card-text>
                    <c-check
                            label="15. ¿Qué especialidades?"
                            v-model="lasEspecialidades"
                            :rules="sinEspecialidades ? '' : 'required'"
                            name="especialidades"
                            :items="especialidades"
                            :disabled="sinEspecialidades"
                    >
                    </c-check>
                    <v-checkbox
                            class="mt-1 ml-2"
                            v-model="sinEspecialidades"
                            label="No sabe"
                            hide-details
                    ></v-checkbox>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'FormEspecialidades',
        props: {
            arrayEspecialidades: {
                type: [Array, String, Number, Boolean],
                default: () => []
            },
          especialidades: {
            type: Array,
            default: () => []
          }
        },
        data: () => ({
            sinEspecialidades: false,
            lasEspecialidades: []
        }),
        watch: {
            'arrayEspecialidades': {
                handler (val) {
                    this.lasEspecialidades = val
                },
                immediate: true
            },
            'sinEspecialidades': {
                handler (val) {
                    if (val) {
                        this.$emit('changeEspecialidades', [])
                    }
                },
                immediate: false
            },
            'lasEspecialidades': {
                handler (val) {
                    this.$emit('changeEspecialidades', val)
                },
                immediate: false
            }
        }
    }
</script>

<style scoped>

</style>