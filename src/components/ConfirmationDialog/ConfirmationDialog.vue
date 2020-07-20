<template>
	<v-dialog v-model="dialog" max-width="500">
		<v-card class="pa-4">
			<v-card-title class="headline px-0 pt-0">{{ heading }}</v-card-title>
			<v-card-text class="px-0 pt-0" v-html="message"></v-card-text>
			<v-card-actions class="pa-0">
				<v-btn :color="colorCancel" @click="close">Cancelar</v-btn>
				<v-spacer></v-spacer>
				<v-btn :color="colorConfirm" @click="$emit('confirm')">Aceptar</v-btn>
			</v-card-actions>
			<app-section-loader :status="loading"></app-section-loader>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: {
			heading: {
				type: String,
				default: ''
			},
			message: {
				type: String,
				default: ''
			},
			colorConfirm: {
				type: String,
				default: 'primary'
			},
			colorCancel: {
				type: String,
				default: ''
			},
			loading: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialog: false
			}
		},
		methods: {
			open() {
				this.dialog = true
			},
			close() {
				this.dialog = false
				this.$emit('cancel')
			}
		}
	}
</script>

