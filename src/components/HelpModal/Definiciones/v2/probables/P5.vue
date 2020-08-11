<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined tile>
                <v-card-text class="text-justify">
                  <v-subheader class="title">Caso asintomático</v-subheader>
                  Es considerado caso asintomático:
                    <br/>
                    <br/>
                  <ul>
                    <li>
                      Contacto estrecho** de caso confirmado de COVID-19 que no ha manifestado síntomas en los primeros 7 días posteriores a la última exposición no protegida ϯ.
                    </li>
                    <li>
                      Personas <u>asintomáticas</u> para COVID-19 que en los últimos treinta (30) días haya sido sometido a un tamizaje previo por un procedimiento quirúrgico (por ejemplo, trasplante), para el ingreso o el retorno al trabajo, para el monitoreo de riesgo en una población cerrada o por iniciativa propia.
                    </li>
                  </ul>
                  <br/>
                  Los contactos estrechos de caso confirmado son registrados inicialmente en el formato “<em>Seguimiento a contactos de casos positivos COVID-19</em>” (Apéndice 2 a la notificación de los casos 346) e ingresados a Sivigila (o CoronApp médico) mediante el Cód. 346 cuando sean contactados uno a uno para la evaluación de síntomas sea por rastreo manual (IEC) o digital (llamada o contact center).
                  <br/>
                  <br/>
                  A las personas asintomáticas que no sean contactos estrechos de caso confirmado se les debe diligenciar ficha Cod-346 pero se ingresan en el sistema sólo si fueron positivas.
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'P5'
    }
</script>

<style scoped>

</style>