<template>
	<v-menu offset-y left origin="right top" z-index="99" content-class="notification-dropdown" transition="slide-y-transition" nudge-top="-10">
		<template v-slot:activator="{ on }">
			<v-btn class="notification-icon ma-0" v-on="on" icon large >
				<v-icon class="grey--text">mdi-bell-ring</v-icon>
			</v-btn>
		</template>
		<div class="dropdown-content">
			<div class="dropdown-top d-custom-flex justify-space-between primary">
				<span class="white--text fw-bold">Notifications</span>
				<span class="v-badge warning">4 NEW</span>
			</div>
			<v-list class="dropdown-list">
				<v-list-item v-for="notification in notifications" :key="notification.title" >
					<v-icon :class="notification.classIcon" class="mr-3">{{notification.icon}}</v-icon>
					<span>{{ $t(notification.title) }}</span>
				</v-list-item>
			</v-list>
		</div>
	</v-menu>
</template>

<script>
	export default {
		data() {
			return {
				notifications: [{
						title: 'message.totalAppMemory',
						icon: 'mdi-server',
						classIcon: 'primary--text'
					},
					{
						title: 'message.totalMemoryUsed',
						icon: 'mdi-memory',
						classIcon: 'warning--text'
					},
					{
						title: 'message.unreadMail',
						icon: 'mdi-email',
						classIcon: 'error--text'
					},
					{
						title: 'message.feedback',
						icon: 'mdi-pencil',
						classIcon: 'success--text'
					}
				]
			}
		}
	}
</script>
