<template>
	<v-container fluid class="py-0" style="height: 100% !important; background-color: white">
		<v-row style="height: 100% !important;" justify="center" align="center">
			<v-card flat class="transparent">
<!--        <boton-a-p-i/>-->
				<v-responsive :aspect-ratio="16/9">
          <template v-if="datosEmpresa.imagen_inicio === 'logoSucre.png'">
            <v-img
                :src="`/static/logos/aspect16-9/${user.tipo_cliente_id}${datosEmpresa.imagen_inicio}`"
            />
          </template>
					<v-img
              v-else
							:src="`/static/logos/aspect16-9/${datosEmpresa.imagen_inicio}`"
					/>
				</v-responsive>
			</v-card>
		</v-row>
	</v-container>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
// import BotonAPI from "../../components/botonAPI";
	export default {
    // components: {BotonAPI},
    data: () => ({
			loading: false
		}),
		computed: {
      ...mapState({
        user: state => state.auth.user
      }),
			...mapGetters([
				'datosEmpresa'
			])
		}
	}
</script>
