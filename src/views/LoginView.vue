<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { saveSessionUser, isAdminUsername } from '../utils/sessionAuth'

const router = useRouter()
const route = useRoute()

const form = reactive({
  username: '',
  password: '',
})

function onSubmit() {
  const username = form.username.trim()
  if (!username) {
    message.warning('请输入用户名')
    return
  }
  saveSessionUser({
    username,
    isAdmin: isAdminUsername(username),
  })
  message.success('登录成功')
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.replace(redirect || '/')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">工单管理系统</h1>
      <p class="hint">用户名 <code>admin</code> 为管理员；其他用户名为普通用户。密码可任意填写。</p>
      <!-- 须绑定 :model，否则提交不会触发 @finish -->
      <a-form :model="form" layout="vertical" @finish="onSubmit">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="form.username" size="large" placeholder="例如 admin" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="form.password" size="large" placeholder="任意值" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block>登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f0f5ff 0%, #fff 45%, #f6ffed 100%);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 32px 28px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
}

.hint {
  margin: 0 0 24px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.55);
  line-height: 1.5;
  text-align: center;
}
</style>
