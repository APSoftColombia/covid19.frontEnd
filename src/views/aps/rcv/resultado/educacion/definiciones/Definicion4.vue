<template>
  <v-col cols="12">
    <v-card
        outlined
        tile
    >
      <v-card-title class="light-blue lighten-4 white--text">
        <v-list-item class="pa-0">
          <v-list-item-content class="pa-0">
            <v-list-item-title class="title font-weight-bold">Riesgo de Episodio cardiovascular a 10 años (IAM o ACV,
              fatal o no fatal)
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-bold" v-text="'Riesgo ≥30%'"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-divider class="pa-0 ma-0"/>
      <v-card-text class="text-justify">
        <p>
          Los individuos de esta categoría tienen un <strong>MUY ALTO RIESGO</strong> de sufrir episodios
          cardiovasculares.
        </p>
        <ul>
          <li>
            <strong>Consumir diariamente frutas y verduras en variedad de tipos y colores.</strong>
          </li>
          <li>
            <strong>Evitar el uso de la sal</strong> y el consumo de alimentos con alto contenido de sodio.
          </li>
          <li>
            Limitar el consumo de alimentos con elevado contenido de grasas y azúcar.
          </li>
          <li>
            <strong>Indicar simvastatina:</strong>
            <ul>
              <li>40 mg/día en personas de entre 40 a 75 años.</li>
              <li>20 mg/día en personas ≥75 años.</li>
            </ul>
          </li>
          <li>
            Sumar <strong>actividad física</strong> moderada al menos 30 minutos por día.
          </li>
          <li>
            Consejo <strong>antitabaco </strong> a fumadores y no fumadores / Intervención breve según estatus /
            Considerar el uso de fármacos.
          </li>
          <li>
            Si la persona presenta <strong>sobrepeso u obesidad</strong> acordar con la persona un plan de alimentación
            orientado a disminuir el consumo de calorías y aumentar progresivamente los niveles de actividad física.
          </li>
          <li>
            <strong>Indicar antiagregación con aspirina en todos los casos</strong>. Si el paciente presenta HTA, antes
            de iniciar la aspirina la TA debe estar controlada.
          </li>
          <li>
            <strong>Limitar</strong> el consumo de <strong>alcohol</strong>, como máximo al día, dos medidas en el
            hombre y una en la mujer.
          </li>
          <li>
            <strong>Manejo de la HTA:</strong> iniciar tratamiento farmacológico en población general de:
            <ul>
              <li>
                entre <u>30 y 59 años</u> con PAS ≥ 140 y/o PAD ≥ 90 mmHg, y
              </li>
              <li>
                en <u>≥ 60 años</u> con PAS ≥ 150 y/o PAD ≥ 90 mmHg.
              </li>
            </ul>
          </li>
        </ul>
      </v-card-text>
      <p class="mt-2 text-center"><strong>Seguimiento cada 3 a 6 meses.</strong></p>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'Definicion4'
}
</script>
