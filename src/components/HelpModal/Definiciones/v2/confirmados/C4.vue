<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined tile>
                <v-card-text class="text-justify">
                  <v-subheader class="title">Muerte por COVID-19</v-subheader>
                  <strong>Muerte confirmada por laboratorio</strong>: muerte probable con RT-PCR o prueba antigénica positiva para SARS-CoV-2 pre o postmórtem.
                    <br/>
                    <br/>
                  <strong>Muerte confirmada por nexo epidemiológico</strong>: muerte probable con RT-PCR o prueba antigénica NEGATIVA que cumple con uno de los siguientes criterios
                  <br/>
                  <ul>
                    <li>
                      La persona fallecida tuvo contacto estrecho previo con caso confirmado de COVID-19 entre 2 días antes y 14 días después del inicio de síntomas de esa persona.
                    </li>
                    <li>
                      Al menos un contacto estrecho de la persona fallecida es detectado como caso confirmado de COVID-19 entre 1 y 14 días después del último contacto sin protección.
                    </li>
                  </ul>
                  <br/>
                  La sensibilidad y la especificidad de esta clasificación aumentan con el uso de criterios clínicos tales como los hallazgos radiológicos pulmonares (opacidades parenquimatosas en vidrio esmerilado o consolidación periférica y de predominio basal), aumento de dímero D, PCR, ferritina o LDH, así como la linfopenia y la trombocitopenia. Estos criterios clínicos son importantes para el análisis de las muertes con prueba confirmatoria negativa, de acuerdo con el Anexo del procedimiento unidad de análisis y los lineamientos del MSPS.
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'C4'
    }
</script>

<style scoped>

</style>