<template>
  <div class="links-page">
    <h1>🔗 Links</h1>
    <p>Feel free to say hello to my friends!</p>
    <div class="links-grid">
      <a 
        v-for="link in friendLinks" 
        :key="link.link" 
        :href="link.link" 
        class="link-card" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img :src="link.avatar" :alt="link.name" class="link-avatar">
        <div class="link-info">
          <span class="link-name">{{ link.name }}</span>
          <span v-if="link.description" class="link-desc">{{ link.description }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { data as friendLinks } from '../data/links.data.ts' 

</script>

<style scoped>
.links-page h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.links-page p {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2.5rem;
}
.links-grid {
  display: grid;
  /* Create a responsive grid layout */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
.link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.25s;
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.link-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: var(--vp-c-brand);
}
.link-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--vp-c-bg-mute);
}
.link-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.link-name {
  font-weight: 600;
  font-size: 1rem;
}
.link-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  /* Limit the description to a maximum of two lines */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>