<template>
    <v-row>
        <v-col class="pb-0" cols="12">
            <v-card outlined tile>
                <v-card-text>
                    <c-check
                            label="17. ¿Que examenes le tomaron?"
                            v-model="losExamenes"
                            :rules="sinExamenes ? '' : 'required'"
                            name="examenes"
                            :items="examenes"
                            :disabled="sinExamenes"
                    >
                    </c-check>
                    <v-checkbox
                            class="mt-1 ml-2"
                            v-model="sinExamenes"
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
        name: 'FormExamenes',
        props: {
            arrayExamenes: {
                type: [Array, String, Number, Boolean],
                default: () => []
            },
          examenes: {
            type: Array,
            default: () => []
          }
        },
        data: () => ({
            sinExamenes: false,
            losExamenes: []
        }),
        watch: {
            'arrayExamenes': {
                handler (val) {
                    this.losExamenes = val
                },
                immediate: true
            },
            'sinExamenes': {
                handler (val) {
                    if (val) {
                        this.$emit('changeExamenes', [])
                    }
                },
                immediate: false
            },
            'losExamenes': {
                handler (val) {
                    this.$emit('changeExamenes', val)
                },
                immediate: false
            }
        },
      methods: {
        noSaber() {
          this.sinExamenes = true
        }
      }
    }
</script>

<style scoped>

</style>