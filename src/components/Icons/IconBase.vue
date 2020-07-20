<template>
    <svg xmlns="http://www.w3.org/2000/svg"
         :width="width"
         :height="height"
         :viewBox="viewBox"
         :aria-labelledby="iconName"
         role="presentation"
    >
        <title :id="iconName">{{iconName}} icon</title>
        <slot></slot>
    </svg>
</template>

<script>
    export default {
        name: 'IconBase',
        props: {
            iconName: {
                type: String,
                default: null
            },
            viewBox: {
                type: String,
                default: null
            },
            width: {
                type: [Number, String],
                default: 18
            },
            height: {
                type: [Number, String],
                default: 18
            }
        }
    }
</script>

<style scoped>

</style>