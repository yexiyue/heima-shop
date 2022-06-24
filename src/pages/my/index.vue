<template>
  <my-user-info v-if="token" class="my-user-container"></my-user-info>
  <my-login v-else></my-login>
</template>

<script lang="ts" setup>
import {useSetBadge} from '@/utils/hooks'
import MyUserInfo from '@/components/my-userInfo/index.vue'
import MyLogin from '@/components/my-login/index.vue'
import {useAddress} from '@/store/address'
import {storeToRefs} from 'pinia'
useSetBadge()

const {token}=storeToRefs(useAddress())
</script>

<style lang="less" scoped>

</style>