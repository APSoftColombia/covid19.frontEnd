<template>
    <div>
        <v-app-bar
                :color="color"
                elevate-on-scroll
        >
            <v-avatar class="mr-2" :class="$route.meta.avatar.personalIcon && $route.meta.avatar.personalIcon === 'Autopsias' ?'pa-2' : ''" size="40" :color="$route.meta.avatar.color">
                <v-icon
                    v-if="!$route.meta.avatar.personalIcon"
                    class="white--text"
                    :size="$route.meta.avatar.iconSize || ''"
                >
                  {{$route.meta.avatar.icon}}
                </v-icon>
                <template v-else>
                    <icon-base
                            v-if="$route.meta.avatar.personalIcon === 'Autopsias'"
                            width="20"
                            height="20"
                            view-box="0 0 528.000000 518.000000"
                            icon-name="autopsia"
                    >
                        <autopsia
                                :fill="'rgba(255, 255, 255, 1)'"
                                translatex="-100.00000"
                                translatey="510.00000"
                        ></autopsia>
                    </icon-base>
                </template>
            </v-avatar>
            <v-list-item two-line class="ma-0 pa-0" v-if="subtitle">
                <v-list-item-content class="ma-0 pa-0">
                    <v-list-item-title>{{title}}</v-list-item-title>
                    <v-list-item-subtitle>{{subtitle}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-toolbar-title class="mr-1" v-else>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <slot name="actions"></slot>
        </v-app-bar>
        <v-divider class="ma-0"></v-divider>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        props: {
            color: {
              type: String,
              default: 'transparent'
            },
            title: {
                type: String,
                default: ''
            },
            subtitle: {
                type: String,
                default: ''
            }
        },
        computed: {
            ...mapState({
                breadcrumb: state => state.general.breadcrumb
            })
        }
    }
</script>
