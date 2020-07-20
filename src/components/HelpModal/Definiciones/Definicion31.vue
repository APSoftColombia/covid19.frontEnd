<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined tile>
                <v-card-text class="text-justify">
                    Basado en la definición nacional para el evento <strong>Infección Respiratoria Aguda Grave (Cód. 345)</strong>,
                    se especifica para la vigilancia intensificada la siguiente definición:
                </v-card-text>
            </v-card>

            <v-card flat>
                <v-card-text class="text-justify">
                    <strong>Caso sospechoso:</strong>  persona con fiebre cuantificada mayor o igual a 38 °C y tos (previo o durante
                    la consulta, la admisión o la hospitalización institucional o domiciliaria), de no más de 10 días de
                    evolución, que requiera manejo intrahospitalario en servicios de urgencias, observación,
                    hospitalización o UCI
                </v-card-text>
            </v-card>
            <v-card outlined tile>
                <v-card-text class="text-center pb-0">
                    Como un mecanismo permanente para la detección de posible circulación de COVID -19, las
                    entidades territoriales deben asegurar la notificación de los casos de IRAG que sean atendidos
                    en UCI, servicios de hospitalización o urgencias. Esto aplica para todas las IPS.
                </v-card-text>
                <v-card-text class="text-center">
                    Los casos hacen parte de la vigilancia por laboratorio, de acuerdo con la circular externa
                    conjunta 031 de 2018. Los casos graves deben ser valorados en las IPS con panel viral y serán
                    evaluados para COVID-19
                </v-card-text>
            </v-card>
            <v-card flat>
                <v-card-text class="text-justify pb-0">
                    Debe asegurarse la notificación de los casos de IRAG en adultos mayores de 60 años o en las
                    personas con comorbilidad o condiciones, tales como: Diabetes, Enfermedad cardiovascular
                    (incluye HTA y ACV), Falla renal, VIH u otra inmunodeficiencia, Cáncer, Enfermedades
                    autoinmunes, Hipotiroidismo, Uso de corticoides o inmunosupresores, EPOC y asma, Mal nutrición
                    (obesidad y desnutrición) y Fumadores.
                </v-card-text>
                <v-card-text class="text-justify pb-0">
                    También se recomienda tener especial atención en personas con IRAG tales como:
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
                    Esto aplica para todas las IPS que ofrecen servicios de urgencias, observación, hospitalización y
                    UCI independientemente que sean centinela.<br>
                    Este tipo de caso requiere de sintomatología respiratoria, si el caso no tiene, NO es caso.<br>
                    Si se detectan casos de otros grupos de edad o de otras comorbilidades que tienen IRAG y están
                    hospitalizados, debe tomarse como caso sospechoso.
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'Definicion31'
    }
</script>

<style scoped>

</style>