<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const history = ref<Message[]>([])
const input = ref('')

const sendMessage = () => {
  if(input.value.trim() === '') return

  history.value.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: input.value
    })
  
  input.value = ''
}
</script>

<template>
  <h1>Chatbot</h1>
  <input type="text" v-model="input" placeholder="Schreib eine Nachricht...">
  <button @click="sendMessage">Absenden</button>

  <div v-for="msg in history" :key="msg.id">
    <strong>{{ msg.role }}:</strong>
    {{ msg.content }}
  </div>
</template>
<style scoped></style>
