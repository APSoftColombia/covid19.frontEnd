<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <template v-slot:activator="{on}">
      <v-btn
          color="blue"
          icon
          v-on="on"
          @click.stop="dialog = true"
      >
        <v-icon>far fa-edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color='indigo'>
          <v-icon left>fas fa-edit</v-icon>
          <v-toolbar-title>Editar Contacto</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-toolbar>
      <v-card-text>
        <ValidationObserver ref="formContacto" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12" sm="12" md="6" lg="6">

            </v-col>
          </v-row>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="white--text" color="indigo">
          <v-icon left>fas fa-save</v-icon>
          <span>Guardar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "EditarContacto",
    data: () => ({
      dialog: false,
    }),
    props: {
      contacto: {
        type: Object,
        default: null
      },
      afiliado: {
        type: Object,
        default: null
      }
    },
  }
</script>

<style scoped>

</style>