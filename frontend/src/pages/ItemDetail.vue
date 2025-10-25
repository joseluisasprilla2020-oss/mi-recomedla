<template>
  <div v-if="item">
    <h2>{{ item.title }}</h2>
    <p>{{ item.year }}</p>
    <p v-if="item.average_rating">⭐ {{ item.average_rating.toFixed(1) }} ({{ item.ratings_count }} reseñas)</p>

    <div v-if="authStore.isAuthenticated" style="margin:16px 0; padding:16px; border:1px solid #eee; border-radius:6px">
      <h3>Agregar reseña</h3>
      <div>
        <label>Puntuación: </label>
        <select v-model="newRating.score">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div><textarea v-model="newRating.comment" placeholder="Comentario (opcional)" rows="3"></textarea></div>
      <button @click="submitRating">Enviar reseña</button>
      <div v-if="ratingError" style="color:red">{{ ratingError }}</div>
    </div>

    <div v-if="ratings.length > 0" style="margin-top:24px">
      <h3>Reseñas</h3>
      <div v-for="rating in ratings" :key="rating.id" style="border:1px solid #eee; padding:8px; margin:8px 0; border-radius:4px">
        <p>⭐ {{ rating.score }}/5</p>
        <p v-if="rating.comment">{{ rating.comment }}</p>
        <small>Por usuario {{ rating.user_id }}</small>
      </div>
    </div>

    <pre style="margin-top:24px">{{ item }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.js';

export default {
  props: ['id'],
  setup(props) {
    const item = ref(null);
    const ratings = ref([]);
    const newRating = ref({ score: 5, comment: '' });
    const ratingError = ref('');
    const authStore = useAuthStore();

    onMounted(async () => {
      await loadItem();
      await loadRatings();
    });

    async function loadItem() {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/media/' + props.id;
      const r = await axios.get(url);
      item.value = r.data;
    }

    async function loadRatings() {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/ratings/media/' + props.id;
      const r = await axios.get(url);
      ratings.value = r.data;
    }

    async function submitRating() {
      try {
        const url = (import.meta.env.VITE_API_URL || '') + '/api/ratings';
        await axios.post(url, {
          media_item_id: props.id,
          score: newRating.value.score,
          comment: newRating.value.comment
        }, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        newRating.value = { score: 5, comment: '' };
        ratingError.value = '';
        await loadItem(); // refresh averages
        await loadRatings();
      } catch (e) {
        ratingError.value = e.response?.data?.message || e.message;
      }
    }

    return { item, ratings, newRating, ratingError, authStore, submitRating };
  }
}
</script>
