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
            <td>Plan de Alimentación</td>
            <td>
              <p>Adoptar de manera gradual un <strong>plan alimentario cardioprotector:</strong></p>
              <ul>
                <li>Limitar el consumo de alimentos con elevados contenidos de grasas y azúcar.</li>
                <li>Consumir diariamente verduras y frutas en variedad de tipos y colores, legumbres y cereales integrales.</li>
                <li><strong>Reducir el uso de la sal</strong> y el consumo de alimentos con alto contenido de sodio.</li>
                <li><strong>Distribuir los alimentos con carbohidratos a lo largo del día</strong>, evitando la inclusión de un volumen importante de los mismos en una sola comida.</li>
                <li>Se recomienda consumir cereales y pastas cocidas al dente o en recalentados para que el almidón sea más resistente a la digestión y de esa manera se absorba más lento en el organismo.</li>
                <li>Un alimento se absorberá más rápido, cuanto más procesado, triturado o picado se encuentre.</li>
                <li><strong>Aumentar el consumo de fibra soluble</strong>, ya que enlentece la absorción de los hidratos de carbono. la podemos encontrar en el salvador de avena, frutas, verduras, legumbres, arroz integral y frutas secas.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Moderar el consumo de alcohol</td>
            <td>
              <ul>
                <li>Limitar el consumo a no más de 2 vasos por día en los hombres y no más de 1 vaso en las mujeres.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Actividad física</td>
            <td>
              <ul>
                <li>Sumar al menos 30 minutos diarios de actividad física aeróbica continuos o fraccionados.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Tabaco</td>
            <td>
              <ul>
                <li>No fumar y evitar la exposición pasiva al humo de tabaco.</li>
              </ul>
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