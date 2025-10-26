<template>
  <div>
    <div v-if="loading" style="text-align:center; margin:20px 0;">
      <div>Cargando...</div>
    </div>
    <div v-else>
      <div style="display:flex; gap:8px; margin-bottom:12px">
        <input v-model="q" placeholder="Buscar..." :disabled="loading" />
        <button @click="search" :disabled="loading">{{ loading ? 'Buscando...' : 'Buscar' }}</button>
        <button @click="loadRecommendations" v-if="authStore.isAuthenticated" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Recomendaciones' }}
        </button>
      </div>
      <div v-if="error" style="color:red; margin-bottom:12px;">{{ error }}</div>
      <div v-if="items.length === 0 && !loading">No hay resultados.</div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px">
        <ItemCard v-for="it in items" :key="it.id" :item="it" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import ItemCard from '../components/ItemCard.vue';
import { useAuthStore } from '../stores/auth.js';

export default {
  components: { ItemCard },
  setup() {
    const q = ref('');
    const items = ref([]);
    const loading = ref(false);
    const error = ref('');
    const authStore = useAuthStore();

    async function search() {
      if (!q.value.trim()) {
        error.value = 'Por favor ingresa un término de búsqueda';
        return;
      }

      loading.value = true;
      error.value = '';

      try {
        const url = (import.meta.env.VITE_API_URL || '') + '/api/media?q=' + encodeURIComponent(q.value);
        const r = await axios.get(url);
        items.value = r.data;
      } catch (e) {
        error.value = e.response?.data?.message || 'Error al buscar. Inténtalo de nuevo.';
        items.value = [];
      } finally {
        loading.value = false;
      }
    }

    async function loadRecommendations() {
      loading.value = true;
      error.value = '';

      try {
        const url = (import.meta.env.VITE_API_URL || '') + '/api/media/recommendations';
        const r = await axios.get(url, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        items.value = r.data;
      } catch (e) {
        error.value = e.response?.data?.message || 'Error al cargar recomendaciones. Inténtalo de nuevo.';
        items.value = [];
      } finally {
        loading.value = false;
      }
    }

    return { q, items, loading, error, search, loadRecommendations, authStore };
  }
}
</script>
