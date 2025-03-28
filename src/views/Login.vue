<template>
  <div class="login-page">
    <div class="login-container">
      <h1>{{ $t('login.title') }}</h1>
      <p class="subtitle">{{ $t('login.subtitle') }}</p>
      
      <GoogleLogin />
      
      <p class="terms">
        {{ $t('login.terms') }}
        <a href="/terms" target="_blank">{{ $t('login.termsLink') }}</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import GoogleLogin from '@/components/GoogleLogin.vue'
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
}

.login-container {
  background: #2a2a2a;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

h1 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.subtitle {
  color: #999;
  margin-bottom: 2rem;
}

.terms {
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
}

.terms a {
  color: #c4804e;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}
</style> 