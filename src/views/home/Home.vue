<template>
	<v-container fluid class="py-0" style="height: 100% !important;">
		<v-row style="height: 100% !important;" justify="center" align="center">
			<v-card flat class="transparent">
				<v-alert dense color="error" v-if="(user && user.change_password_needed) || (user && user.password_will_expired_on !== null)">
					<v-row align="center" class="white--text">
						<v-col cols="8">
							<v-icon left>fas fa-exclamation-triangle</v-icon>
							{{ user.password_will_expired_on !== null ? user.password_will_expired_on : 'Para inciar a usar el sistema, por favor, cambie su contraseña.' }}
						</v-col>
						<v-spacer></v-spacer>
						<v-col class="shrink">
							<v-btn
								class="black white--text"
								@click="$refs.dialogChangePassword.open(true)"
							>Cambiar contraseña</v-btn>
						</v-col>
					</v-row>
				</v-alert>
				<v-responsive :aspect-ratio="16/9">
					<v-img
							:src="`/static/logos/aspect16-9/${datosEmpresa.imagen_inicio}`"
					>
					</v-img>
				</v-responsive>
			</v-card>
		</v-row>
		<change-password ref="dialogChangePassword"></change-password>
	</v-container>
</template>

<script>
	import {mapGetters, mapState} from 'vuex'
	export default {
		components: {
			ChangePassword: () => import('../../components/Header/ChangePassword.vue')
		},
		data: () => ({
			loading: false
		}),
		computed: {
			...mapGetters([
				'datosEmpresa'
			]),
			...mapState({
				user: state => state.auth.user
			}),
		}
	}
</script>
