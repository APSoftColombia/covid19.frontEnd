<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined tile>
                <v-card-text class="text-justify">
                    Basado en la definición de Infección Respiratoria Aguda Leve (equivalente Enfermedad Similar a
                    la Influenza - ESI) Cód. 345
                </v-card-text>
            </v-card>
            <v-card flat>
                <v-card-text class="text-justify pb-0">
                    <strong>Caso sospechoso:</strong>   persona con fiebre cuantificada mayor o igual a 38 °C y tos (previo o durante
                    la consulta o la visita domiciliaria), de no más de 7 días de evolución, que no requiera manejo
                    intrahospitalario, servicios de urgencias u observación.
                </v-card-text>
                <v-card-text class="text-justify pb-0">
                    Debe hacerse <strong>énfasis</strong> en la notificación de los casos de IRA en adultos mayores de 60 años o en
                    las personas con comorbilidad o condiciones, tales como: diabetes, enfermedad cardiovascular
                    (incluye hipertensión y ACV), VIH u otra inmunodeficiencia, cáncer, enfermedad renal,
                    enfermedades autoinmunes, hipotiroidismo, EPOC y asma, uso de corticoides o
                    inmunosupresores, mal nutrición (obesidad y desnutrición) y, fumadores.
                </v-card-text>
                <v-card-text class="text-justify pb-0">
                    También se recomienda tener especial atención en personas con IRA tales como:
                    <ul>
                        <li>Trabajadores de la salud incluido personal administrativo</li>
                        <li>Policía y Fuerzas Militares</li>
                        <li>Empleados de servicios de protección social de la niñez, la adolescencia o del adulto mayor</li>
                        <li>Empleados de establecimientos penitenciarios, estaciones de policía y URI.</li>
                        <li>Grupos étnicos (indígenas, comunidades negras, afrocolombianos, raizales, palenqueros y rom)</li>
                        <li>Personas en situación de calle</li>
                        <li>Personas privadas de la libertad</li>
                        <li>Personas en alta movilidad en virtud de su ocupación laboral***</li>
                        <li>Migrantes colombianos internos.</li>
                    </ul>
                </v-card-text>
                <v-card-text class="text-justify pb-0">
                    Este tipo de caso requiere de sintomatología respiratoria, si el caso no tiene, <strong>NO</strong> es caso.
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'Definicion32'
    }
</script>

<style scoped>

</style>