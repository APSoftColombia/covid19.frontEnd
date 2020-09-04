<template>
  <v-col cols="12">
    <v-card outlined tile>
      <v-card-text>
        <span class="title">Recomendaciones</span>
        <table border="1" id="tabla-recomendaciones">
          <thead>
          <tr>
            <th class="text-left">Modificación</th>
            <th class="text-left">Recomendación</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>ALIMENTACIÓN</td>
            <td>
              <ul>
                <li class="black--text">Consumo de alimentos como: lentejas, frijoles, maíz, avena, trigo, arroz, y tubérculos o raíces
                  como papa, o la yuca. (no mezclar papa y arroz, se convierten en glucosa y aumenta los niveles de
                  azúcar en la sangre).</li>
                <li class="black--text">Consumo de alimentos de origen animal (carne, pescado, huevos y leche).</li>
                <li class="black--text">Consumo de (cinco porciones) de verduras y frutas al día o una porción es equivalente, por
                  ejemplo, a una sola naranja, manzana, mango, un plátano o banana o 3 cucharadas de verduras
                  cocidas. Exceptuar frutas dulces en personas diabéticas.</li>
                <li class="black--text">Cocinar con menos de una cucharadita de sal (5gr) y no consumir sal adicional en los alimentos
                  preparados.</li>
                <li class="black--text">En lugar de tomar el caldo de la sopa, comer solo los ingredientes.</li>
                <li class="black--text">Limitar también el consumo de alimentos encurtidos y procesados, como la salsa de tomate, los
                  embutidos o el jamón.</li>
                <li class="black--text">Es muy recomendable consumir alimentos frescos y saludables.</li>
                <li class="black--text">Reduzca el consumo de fritos y alimentos ricos en grasa y sustitúyalos por el consumo de
                  aguacate y frutos secos.</li>
                <li class="black--text">Si los pacientes son Anticoagulados NO se debe consumir verduras de Hojas verdes.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>ACTIVIDAD FÍSICA</td>
            <td>
              <ul>
                <li class="black--text">Realizar 150 minutos de actividad física moderada a la semana buscando un aumento leve en la
                  frecuencia cardíaca. Los ejercicios recomendados son: caminar a paso ligero, subir escaleras,
                  bailar, llevar a cabo tareas de jardinería o domésticas.</li>
                <li class="black--text">Ejecutar 75 minutos de actividad física vigorosa a la semana que incluya: correr, montar en
                  bicicleta, nadar o practicar algún deporte.</li>
                <li class="black--text">Personas con limitación de la movilidad deben realizar actividad física tres o más días a la
                  semana, teniendo en cuenta la limitación que presenta.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>CONSUMO DE CIGARRILLO</td>
            <td>
              <p class="mb-1"><strong>Evitar el consumo de tabaco:</strong></p>
              <ul>
                <li class="black--text">Disminuye el riesgo de infarto agudo de miocardio.</li>
                <li class="black--text">Ahorro de dinero, que puede ser invertido en otras necesidades.</li>
                <li class="black--text">Mejora el estado de la piel, dientes y aliento.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>CONSUMO DE ALCOHOL</td>
            <td>
              <ul>
                <li class="black--text">El consumo de alcohol aumenta el riesgo de sufrir un infarto agudo de miocardio o un ataque
                  cerebrovascular.</li>
                <li class="black--text">El consumo de alcohol aumenta el riesgo de sufrir ciertos tipos de cáncer y puede causar daño en
                  otras partes del organismo.</li>
                <li class="black--text">No consuma alcohol cuando realice las siguientes actividades o se encuentre en las siguientes
                  situaciones:
                  <ul>
                    <li class="black--text" style="list-style: circle !important;">Conducir.</li>
                    <li class="black--text" style="list-style: circle !important;">Operar maquinaria.</li>
                    <li class="black--text" style="list-style: circle !important;">Embarazo.</li>
                    <li class="black--text" style="list-style: circle !important;">Lactancia materna.</li>
                    <li class="black--text" style="list-style: circle !important;">Cuando se encuentre tomando medicamentos que interactúen con el alcohol.</li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>CONSUMO DE CAFEÍNA</td>
            <td>
              <p class="black--text mb-0">La persona que consume café puede tener una subida momentánea de la <strong>tensión</strong>, por lo cual se
                debe evitar el consumo del mismo</p>
            </td>
          </tr>
          </tbody>
        </table>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
    export default {
        name: 'Recomendaciones'
    }
</script>

<style scoped>
  #tabla-recomendaciones thead th {
    padding: 10px !important;
  }
  #tabla-recomendaciones tbody td {
    padding: 10px !important;
  }
</style>