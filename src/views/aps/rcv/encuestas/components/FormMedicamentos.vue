<template>
    <v-row>
        <v-col class="pb-0" cols="12">
            <v-card outlined tile>
                <v-card-text>
                    <ValidationProvider name="medicamentos" :rules="sinMedicamentos || otros ? '' : 'required'" v-slot="{ errors, valid }">
                      <v-radio-group class="ma-0" key="grupoLabelxx">
                        <label
                            class="mb-1 v-messages__message"
                            style="width: 100% !important; line-height: inherit !important; text-align: justify !important;"
                        >
                          19. ¿Que tipo de medicamentos?
                        </label>
                      </v-radio-group>
<!--                      <v-row justify="space-around">-->
                      <v-row class="mx-0" style="flex-wrap: nowrap !important; overflow-x: auto !important;">
                        <template v-for="(tipo, indexTipo) in Object.keys(medicamentos)">
                          <v-card color="blue-grey lighten-5" class="mr-2 elevation-0" min-width="230"  tile :key="`grupoLabel${indexTipo}`">
                            <v-card-text>
                              <v-radio-group class="ma-0" hide-details>
                                <label
                                    class="mb-1 v-messages__message font-weight-bold"
                                    style="width: 100% !important; line-height: inherit !important; text-align: justify !important;"
                                >
                                  {{tipo}}
                                </label>
                              </v-radio-group>
                              <template v-for="(check, indexCheck) in Object.values(medicamentos)[indexTipo]">
                                <v-checkbox
                                    :key="`check${indexTipo}${indexCheck}`"
                                    v-model="losMedicamentos"
                                    :value="check['id']"
                                    :label="check['nombre']"
                                    :disabled="sinMedicamentos"
                                    :error="!!errors.length"
                                    hide-details
                                    class="mt-2"
                                ></v-checkbox>
                              </template>
                            </v-card-text>
                          </v-card>
                        </template>
                      </v-row>
                      <div class="mt-2 mb-4 v-messages theme--light error--text" role="alert" v-if="errors.length && !sinMedicamentos">
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            {{errors[0]}}
                          </div>
                        </div>
                      </div>
                    </ValidationProvider>
                  <div class="mt-5">
                    <c-texto
                        v-model="otros"
                        label="Otros Medicamentos"
                        :rules="(losMedicamentos && losMedicamentos.length) || sinMedicamentos ? '' : 'required'"
                        name="otros medicamentos"
                        upper-case
                        :disabled="sinMedicamentos"
                    >
                    </c-texto>
                  </div>
                    <v-checkbox
                            class="mt-0 ml-2"
                            v-model="sinMedicamentos"
                            label="Desconoce los tipos de medicamentos"
                            hide-details
                    ></v-checkbox>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'FormMedicamentos',
        props: {
            arrayMedicamentos: {
                type: [Array, String, Number, Boolean],
                default: () => []
            },
          medicamentos: {
            type: Object,
            default: null
          },
          otrosmedicamentos: {
            type: String,
            default: null
          }
        },
        data: () => ({
            sinMedicamentos: false,
            losMedicamentos: [],
            otros: null
        }),
        watch: {
            'arrayMedicamentos': {
                handler (val) {
                    this.losMedicamentos = val
                },
                immediate: true
            },
            'otrosmedicamentos': {
                handler (val) {
                    this.otros = val
                },
                immediate: true
            },
            'sinMedicamentos': {
                handler (val) {
                    if (val) {
                        this.$emit('changeMedicamentos', [])
                        this.$emit('changeOtros', null)
                    }
                },
                immediate: false
            },
            'losMedicamentos': {
                handler (val) {
                    this.$emit('changeMedicamentos', val)
                },
                immediate: false
            },
          'otros': {
            handler (val) {
              this.$emit('changeOtros', val)
            },
            immediate: false
          }
        },
      methods: {
        noSaber() {
          this.sinMedicamentos = true
        }
      }
    }
</script>

<style scoped>

</style>