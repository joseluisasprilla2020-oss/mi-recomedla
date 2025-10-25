<template>
  <div>
    <div style="display:flex; gap:8px; margin-bottom:12px">
      <input v-model="q" placeholder="Buscar..." />
      <button @click="search">Buscar</button>
      <button @click="loadRecommendations" v-if="authStore.isAuthenticated">Recomendaciones</button>
    </div>
    <div v-if="items.length === 0">No hay resultados.</div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px">
      <ItemCard v-for="it in items" :key="it.id" :item="it" />
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
    const authStore = useAuthStore();

    async function search() {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/media?q=' + encodeURIComponent(q.value);
      const r = await axios.get(url);
      items.value = r.data;
    }

    async function loadRecommendations() {
      try {
        const url = (import.meta.env.VITE_API_URL || '') + '/api/media/recommendations';
        const r = await axios.get(url, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        items.value = r.data;
      } catch (error) {
        console.error('Error loading recommendations:', error);
        items.value = [];
      }
    }

    return { q, items, search, loadRecommendations, authStore };
  }
}
</script>
