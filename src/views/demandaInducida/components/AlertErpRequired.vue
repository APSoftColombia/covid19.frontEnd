<template>
  <div>
    <template v-if="value.erp_required && !value.erp_id">
      <v-icon color="red" class="mr-1">mdi-alert</v-icon>
      <span class="mr-1">Se requiere ERP</span>
      <v-tooltip top v-if="permisos.tamizajeCrear">
        <template v-slot:activator="{on}">
          <v-btn depressed fab x-small color="primary" v-on="on" @click="$emit('crearTamizaje')">
            <v-icon>fas fa-file-medical</v-icon>
          </v-btn>
        </template>
        <span>Crear ERP</span>
      </v-tooltip>
    </template>
    <template v-if="value.erp_id">
      <v-btn color="primary" @click="$emit('detalleTamizaje')">
        <v-icon>mdi-file-find</v-icon>
        ERP {{value.erp_id}}
      </v-btn>
    </template>
  </div>
</template>
<script>
    export default {
        name: 'CrearEncuestaDemanda',
        props: {
            value: {
                Object,
                required: true
            }
        },
        data: () => ({

        }),
      computed: {
        permisos () {
          return this.$store.getters.getPermissionModule('covid')
        }
      }
    }
</script>