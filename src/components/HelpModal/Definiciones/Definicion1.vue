<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined tile>
                <v-card-text class="text-justify">
                    Basado en la definición nacional para el evento <strong>Infección Respiratoria Aguda Grave inusitado
                    (Cód. 348)</strong>, se especifica para la vigilancia intensificada la siguiente definición:
                    <v-divider></v-divider>
                    La definición de caso 1 (Cód. 348) estará vigente por el periodo de transición de apertura de la
                    cuarentena. Progresivamente ante la disponibilidad de pruebas antigénicas y de anticuerpos se
                    utilizarán únicamente las otras 3 definiciones
                </v-card-text>
            </v-card>
            <v-card flat>
                <v-card-text class="text-justify pb-0">
                    <strong>Caso probable:</strong> persona con fiebre cuantificada mayor o igual a 38 °C y tos (previo o durante la
                    consulta, la admisión o la hospitalización institucional o domiciliaria), con cuadro de infección
                    respiratoria aguda grave -IRAG que desarrolla un curso clínico inusual o inesperado,
                    especialmente un deterioro repentino a pesar del tratamiento adecuado, que, <strong>Sí</strong> requiere
                    hospitalización, <strong>IRAG inusitado – Cód. 348</strong> <u>y cumpla con al menos una de las siguientes
                    condiciones:</u>
                </v-card-text>
                <v-card-text class="text-justify pb-0">
                    <ul>
                        <li>
                            Historial de viaje internacional o a zonas de Colombia con transmisión local comunitaria* en
                            los 14 días anteriores al inicio de los síntomas. (Ver, tabla publicada en el micrositio del INS:
                            <a href="http://www.ins.gov.co/Noticias/Paginas/Coronavirus.aspx" target="_blank">http://www.ins.gov.co/Noticias/Paginas/Coronavirus.aspx</a>)
                        </li>
                        <li>
                            Trabajador de la salud u otro personal del ámbito hospitalario, en ejercicio, que haya tenido
                            contacto estrecho** con caso confirmado o probable por COVID-19.
                        </li>
                        <li>
                            Antecedentes de contacto estrecho* en los últimos 14 días con un caso confirmado con
                            infección respiratoria aguda grave asociada a COVID-19.
                        </li>
                    </ul>
                </v-card-text>
                <v-card-text class="text-justify">
                    Para aclarar el estado afebril de la persona, indagar si está consumiendo medicamentos
                    antinflamatorios o acetaminofén. Los aeropuertos colombianos se encuentran cerrados para el transporte de personas; sin
                    embargo, se mantienen vuelos internacionales especiales (misiones humanitarias, deportaciones
                    o repatriaciones) y los vuelos militares y de carga de estos vuelos puede proceder aún pasajeros
                    que cumple con el historial de viaje de esta definición (decreto 457 de 2020); recordar que hay
                    viajeros internacionales que cruzan ilegalmente la frontera.

                </v-card-text>
            </v-card>
            <v-card outlined tile>
                <v-card-text class="text-justify">
                    Estos casos deben ser informados de manera <strong>INMEDIATA</strong>, telefónicamente, a la Secretaria de
                    Salud Departamental o Distrital. Al mismo tiempo se solicita que el caso sea ingresado en el
                    subsistema de información Sivigila.
                    <v-divider></v-divider>
                    Los casos deben ser reportados desde el estado probable. El reporte sólo cuando el caso es
                    confirmado favorece mantener las cadenas de transmisión.
                    <v-divider></v-divider>
                    El Laboratorio de salud pública departamental o distrital debe informar a la oficina de vigilancia
                    sobre la recepción de muestras que serán enviadas al laboratorio de referencia
                    <v-divider></v-divider>
                    El listado de municipios colombianos con circulación activo será publicado desde la terminación
                    de la cuarentena.
                </v-card-text>
            </v-card>
            <v-card outlined tile class="mt-4">
                <v-card-text class="text-justify">
                    Las definiciones operativas de caso están sujetas a cambios y serán actualizadas de acuerdo con
                    la dinámica del evento.
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'Definicion1'
    }
</script>

<style scoped>

</style>