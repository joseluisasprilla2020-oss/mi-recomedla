<template>
  <div style="max-width:420px">
    <h2>Registro</h2>
    <div v-if="loading" style="text-align:center; margin:20px 0;">
      <div>Cargando...</div>
    </div>
    <div v-else>
      <div>
        <input v-model="name" placeholder="Nombre" :disabled="loading" />
        <div v-if="errors.name" style="color:red; font-size:12px;">{{ errors.name }}</div>
      </div>
      <div>
        <input v-model="email" placeholder="Email" type="email" :disabled="loading" />
        <div v-if="errors.email" style="color:red; font-size:12px;">{{ errors.email }}</div>
      </div>
      <div>
        <input v-model="password" placeholder="Contraseña" type="password" :disabled="loading" />
        <div v-if="errors.password" style="color:red; font-size:12px;">{{ errors.password }}</div>
      </div>
      <div>
        <input v-model="confirmPassword" placeholder="Confirmar Contraseña" type="password" :disabled="loading" />
        <div v-if="errors.confirmPassword" style="color:red; font-size:12px;">{{ errors.confirmPassword }}</div>
      </div>
      <button @click="doRegister" :disabled="loading || !isFormValid">
        {{ loading ? 'Registrando...' : 'Registrar' }}
      </button>
      <div v-if="error" style="color:red; margin-top:10px;">{{ error }}</div>
      <div v-if="success" style="color:green; margin-top:10px;">{{ success }}</div>
      <div style="margin-top:16px">
        <router-link to="/login">¿Ya tienes cuenta? Inicia sesión</router-link>
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
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    const success = ref('');
    const loading = ref(false);
    const errors = ref({});
    const router = useRouter();
    const authStore = useAuthStore();

    const isFormValid = computed(() => {
      return name.value.trim() &&
             email.value.trim() &&
             password.value.length >= 6 &&
             confirmPassword.value === password.value;
    });

    function validateForm() {
      errors.value = {};
      if (!name.value.trim()) {
        errors.value.name = 'El nombre es obligatorio';
      }
      if (!email.value.trim()) {
        errors.value.email = 'El email es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = 'El email no es válido';
      }
      if (!password.value) {
        errors.value.password = 'La contraseña es obligatoria';
      } else if (password.value.length < 6) {
        errors.value.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (!confirmPassword.value) {
        errors.value.confirmPassword = 'Debes confirmar la contraseña';
      } else if (confirmPassword.value !== password.value) {
        errors.value.confirmPassword = 'Las contraseñas no coinciden';
      }
      return Object.keys(errors.value).length === 0;
    }

    async function doRegister() {
      if (!validateForm()) return;

      loading.value = true;
      error.value = '';
      success.value = '';

      try {
        await authStore.register(name.value, email.value, password.value);
        success.value = '¡Registro exitoso! Redirigiendo al login...';
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (e) {
        error.value = e.response?.data?.message || e.message || 'Error al registrar usuario';
      } finally {
        loading.value = false;
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      doRegister,
      error,
      success,
      loading,
      errors,
      isFormValid
    };
  }
}
</script>
