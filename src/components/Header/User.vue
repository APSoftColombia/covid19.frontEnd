<template>
   <div>
       <v-menu offset-y origin="right top" left content-class="notification-dropdown" transition="slide-y-transition" nudge-top="0">
           <template v-slot:activator="{ on }">
               <v-list-item v-on="on" class="pa-0" style="max-width: 260px !important;">
                   <v-list-item-avatar class="mx-2">
                       <img :src="getUrlAvatar" alt="avatar" height="40" width="40" class="img-responsive" />
                   </v-list-item-avatar>
                   <v-list-item-content v-if="user && $vuetify.breakpoint.mdAndUp">
                       <v-list-item-title><span class="text-truncate">{{user.name}}</span></v-list-item-title>
                       <v-list-item-subtitle class="caption text-truncate">{{user.email}}</v-list-item-subtitle>
                   </v-list-item-content>
               </v-list-item>
           </template>
           <div class="dropdown-content" v-if="onLine">
               <div class="dropdown-top d-custom-flex justify-space-between primary">
                   <span class="white--text fw-bold">Opciones de usuario</span>
               </div>
               <v-list class="dropdown-list">
                   <v-list-item @click="$refs && $refs.dialogChangePassword.open()">
                       <v-icon left color="warning">mdi-key</v-icon>
                       <span>Cambiar contraseña</span>
                   </v-list-item>
                   <v-list-item @click="logoutUser">
                       <v-icon left color="error">mdi-power</v-icon>
                       <span>Cerrar sesión</span>
                   </v-list-item>
               </v-list>
           </div>
       </v-menu>
       <change-password ref="dialogChangePassword"></change-password>
   </div>
</template>
<script>
   import { mapState, mapGetters } from 'vuex'
   export default{
       components: {
           ChangePassword: () => import('./ChangePassword')
       },
      data: () => ({
      }),
      computed: {
         ...mapState({
            user: state => state.auth.user
         }),
         ...mapGetters([
            'getUrlAvatar',
             'onLine'
         ])
      },
     mounted() {
       window.FreshworksWidget('show')
       window.FreshworksWidget('identify', 'ticketForm', {
         name: this.user.name,
         email: this.user.email,
       })
       window.FreshworksWidget('hide', 'ticketForm', ['name', 'email'])
     },
     methods: {
         logoutUser() {
            this.$store.commit('logoutUser', this.$router)
         }
      }
   }
</script>
