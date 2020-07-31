<template>
    <v-row>
        <v-col class="pb-0" cols="12">
            <v-card outlined tile>
                <v-card-text>
                    <c-check
                            v-model="losSintomas"
                            label="Usted presenta alguno de los siguientes síntomas:"
                            :rules="sinSintomas ? '' : 'required'"
                            name="sintomas"
                            :items="sintomas"
                            item-text="descripcion"
                            item-value="id"
                            :disabled="sinSintomas"
                    >
                    </c-check>
                    <v-checkbox
                            class="mt-1 ml-2"
                            v-model="sinSintomas"
                            label="Ninguno de los anteriores"
                            hide-details
                    ></v-checkbox>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'FormSIntomas',
        props: {
            arraySintomas: {
                type: [Array, String, Number, Boolean],
                default: () => []
            },
          sintomas: {
            type: Array,
            default: () => []
          }
        },
        data: () => ({
            sinSintomas: false,
            losSintomas: []
        }),
        watch: {
            'arraySintomas': {
                handler (val) {
                    this.losSintomas = val
                },
                immediate: true
            },
            'sinSintomas': {
                handler (val) {
                    if (val) {
                        this.$emit('changeSintomas', [])
                    }
                },
                immediate: false
            },
            'losSintomas': {
                handler (val) {
                    this.$emit('changeSintomas', val)
                },
                immediate: false
            }
        }
    }
</script>

<style scoped>

</style>