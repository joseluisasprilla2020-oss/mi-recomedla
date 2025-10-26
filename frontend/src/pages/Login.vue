<template>
  <div style="max-width:420px">
    <h2>Iniciar Sesión</h2>
    <div v-if="loading" style="text-align:center; margin:20px 0;">
      <div>Iniciando sesión...</div>
    </div>
    <div v-else>
      <div>
        <input v-model="email" placeholder="Email" type="email" :disabled="loading" />
        <div v-if="errors.email" style="color:red; font-size:12px;">{{ errors.email }}</div>
      </div>
      <div>
        <input v-model="password" placeholder="Contraseña" type="password" :disabled="loading" />
        <div v-if="errors.password" style="color:red; font-size:12px;">{{ errors.password }}</div>
      </div>
      <button @click="doLogin" :disabled="loading || !isFormValid">
        {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
      </button>
      <div v-if="error" style="color:red; margin-top:10px;">{{ error }}</div>
      <div style="margin-top:16px">
        <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);
    const errors = ref({});
    const router = useRouter();
    const authStore = useAuthStore();

    const isFormValid = computed(() => {
      return email.value.trim() && password.value.trim();
    });

    function validateForm() {
      errors.value = {};
      if (!email.value.trim()) {
        errors.value.email = 'El email es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = 'El email no es válido';
      }
      if (!password.value.trim()) {
        errors.value.password = 'La contraseña es obligatoria';
      }
      return Object.keys(errors.value).length === 0;
    }

    async function doLogin() {
      if (!validateForm()) return;

      loading.value = true;
      error.value = '';

      try {
        await authStore.login(email.value, password.value);
        router.push('/');
      } catch (e) {
        error.value = e.response?.data?.message || e.message || 'Error al iniciar sesión';
      } finally {
        loading.value = false;
      }
    }

    return {
      email,
      password,
      doLogin,
      error,
      loading,
      errors,
      isFormValid
    };
  }
}
</script>
