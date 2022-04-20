<template>
  <v-col cols="12">
    <v-card
        outlined
        tile
    >
      <v-card-text>
        <span class="title">Semáforo de la Alimentación</span>
        <v-alert
            dense
            border="left"
            color="red accent-2"
            class="mb-1"
        >
          <strong>Alimentos que hay que limitar su consumo. Limitar el consumo de alimento que:</strong>
        </v-alert>
        <v-alert
            dense
            border="left"
            color="red lighten-4"
        >
          <strong>Contienen elevadas cantidades de azucares simples y calorias:</strong> azúcar, tortas, caramelos
          galletitas dulces, bebidas con azúcar, miel, mermeladas comunes, galletitas con relleno, leche condensada,
          helados (a excepción de los sin grasa y sin azúcar) fruta confitada, chocolate, golosinas, productos de
          copetín (como palitos salados, papas fritas de paquete).
          <br/>
          <br/>
          <strong>Contienen alto contenido en grasa:</strong> manteca, carnes grasas, frituras, lácteos enteros, crema,
          aderezos (mayonesa, salsa golf) quesos enteros.
        </v-alert>
        <v-alert
            dense
            border="left"
            color="amber lighten-3"
            class="mb-1"
        >
          <strong>Alimentos que hay que moderar su consumo. Moderar el consumo de alimentos que:</strong>
        </v-alert>
        <v-alert
            dense
            border="left"
            color="yellow lighten-4"
        >
          <strong>Contienen una importante cantidad de hidratos de carbono complejos:</strong> cereales, pasta, arroz,
          papa, batata, choclo, mandioca, banana, uva, masa de tarta, empanadas, pizza, panes y panificados, galletas de
          agua o salvado, barra de cereal.
          <br/>
          <br/>
          <strong>Por su alto contenido graso:</strong> tener precaución con el queso por salut descremado. huevo hasta
          uno por día.
        </v-alert>
        <v-alert
            dense
            border="left"
            color="cyan lighten-1"
            class="mb-1"
        >
          <strong>Alimentos de libre consumo.</strong>
        </v-alert>
        <v-alert
            dense
            border="left"
            color="cyan lighten-4"
        >
          <strong>Bajo contenido de hidratos de carbono:</strong> verduras de hoja verde (espinacas, acelga, luchuga,
          brócoli, rúcula, radicheta), zapatillo, tomate, coliflor, zanahoria cruda.
          <br/>
          <strong>Prácticamente no contiene hidratos de carbono y calorías:</strong> infusiones (té, café, infusiones de
          hierbas) agua mineral, bebidas sin azúcar, jugos para preparar sin azúcar, yerba mate, condimentos (ajo,
          pimienta, laurel, vinagre, mostaza, canela, perejil, etc).
        </v-alert>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'SemaforoAlimentacion'
}
</script>
