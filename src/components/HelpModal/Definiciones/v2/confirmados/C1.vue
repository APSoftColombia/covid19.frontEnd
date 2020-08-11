<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined tile>
                <v-card-text class="text-justify">
                  <v-subheader class="title">Infección Respiratoria Aguda Grave o Enfermedad por Coronavirus - COVID grave</v-subheader>
                  <strong>Caso confirmado por laboratorio</strong>: caso probable con RT-PCR o prueba antigénica positiva para SARS-CoV-2.
                    <br/>
                    <br/>
                  <strong>Caso confirmado por nexo epidemiológico</strong>: caso probable con RT-PCR o prueba antigénica NEGATIVA que cumple con uno de los siguientes criterios
                  <br/>
                  <ul>
                    <li>
                      La persona tuvo contacto estrecho previo con caso confirmado de COVID-19 entre 2 días antes y 14 días después del inicio de síntomas de esa persona.
                    </li>
                    <li>
                      Al menos un contacto estrecho de la persona es detectado como caso confirmado de COVID-19 entre 1 y 14 días después del último contacto sin protección.
                    </li>
                  </ul>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'C1'
    }
</script>

<style scoped>

</style>