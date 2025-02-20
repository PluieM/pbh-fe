<template>
  <a-row justify="center">
    <a-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
      <a-space direction="vertical" fill>
        <a-typography-title :heading="3">{{ $t('login.form.title') }}</a-typography-title>
        <a-form
          ref="loginForm"
          :model="loginConfig"
          class="login-form"
          layout="vertical"
          @submit="handleSubmit"
        >
          <a-form-item
            field="token"
            :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
            :validate-trigger="['change', 'input']"
            hide-label
          >
            <a-input-password
              v-model="loginConfig.token"
              :placeholder="$t('login.form.password.placeholder')"
              allow-clear
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item field="rememberPassword" class="login-form-password-actions">
            <a-checkbox checked="rememberPassword" :model-value="loginConfig.rememberPassword">
              {{ $t('login.form.rememberPassword') }}
            </a-checkbox>
            <a-link
              :style="{ marginLeft: 'auto' }"
              href="https://github.com/PBH-BTN/PeerBanHelper/wiki/%E5%A6%82%E4%BD%95%E9%87%8D%E7%BD%AEToken"
            >
              {{ $t('login.form.forgetPassword') }}
            </a-link>
          </a-form-item>
          <a-button type="primary" html-type="submit" long :loading="loading">
            {{ $t('login.form.login') }}
          </a-button>
        </a-form>
      </a-space>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref, type UnwrapRef } from 'vue'
import { Message, type FormInstance } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()
const { t } = useI18n()
const loading = ref(false)
const loginConfig = ref({
  rememberPassword: true,
  token: endpointStore.authToken
})
const loginForm = ref<FormInstance>()
const handleSubmit: FormInstance['onSubmit'] = async ({ errors, values }) => {
  const errorFields = errors ? Object.keys(errors) : []
  if (errorFields.length > 0) {
    loginForm.value?.scrollToField(errorFields[0])
    return
  }
  const { token, rememberPassword } = values as UnwrapRef<typeof loginConfig>
  if (loading.value) return
  loading.value = true
  loginForm.value?.setFields({
    token: { status: 'validating', message: '' }
  })
  try {
    await endpointStore.setAuthToken(token, rememberPassword)
    Message.success(t('login.form.login.success'))
  } catch (err) {
    loginForm.value?.setFields({
      token: {
        status: 'error',
        message: `${t('login.form.login.failed')}  ${(err as Error).message}`
      }
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped></style>
