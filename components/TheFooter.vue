<template>
  <footer class="bg-gray-800">
    <div class="max-w-7xl border-l border-r border-dashed border-gray-700 mx-auto px-4">
      <div class="pt-5 pb-12 md:flex md:items-center md:justify-between">
        <div class="flex space-x-6 md:order-2">
          <a v-if="$config.social.youtube" target="_blank" rel="noreferrer" :href="`https://youtube.com/c/${$config.social.youtube}`" class="text-gray-400 hover:text-gray-300">
            <span class="sr-only">YouTube</span>

            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
              <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
            </svg>

            </svg>
          </a>
          <a v-if="$config.social.github" target="_blank" rel="noreferrer" :href="`https://github.com/${$config.social.github}`" class="text-gray-400 hover:text-gray-300">
            <span class="sr-only">GitHub</span>
            <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
          <a v-if="$config.social.linkedin" target="_blank" rel="noreferrer" :href="`https://linkedin.com/in/${$config.social.linkedin}`" class="text-gray-400 hover:text-gray-300">
            <span class="sr-only">LinkedIn</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" viewBox="0 0 16 16"><g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)"><path d="M2.5,8.5h4C6.776,8.5,7,8.724,7,9v13c0,0.276-0.224,0.5-0.5,0.5h-4C2.224,22.5,2,22.276,2,22V9C2,8.724,2.224,8.5,2.5,8.5z M4.48,1.5c1.37,0,2.48,1.119,2.48,2.5S5.85,6.5,4.48,6.5S2,5.381,2,4S3.11,1.5,4.48,1.5z M18.5,22.5h3c0.276,0,0.5-0.224,0.5-0.5 v-8.4C22,9.83,19.87,8,16.89,8c-1.189-0.043-2.34,0.418-3.17,1.27c-0.148,0.171-0.407,0.19-0.578,0.042C13.051,9.233,13,9.12,13,9 c0-0.276-0.224-0.5-0.5-0.5h-3C9.224,8.5,9,8.724,9,9v13c0,0.276,0.224,0.5,0.5,0.5h3c0.276,0,0.5-0.224,0.5-0.5v-7.5 c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5V22C18,22.276,18.224,22.5,18.5,22.5z" stroke="none" fill="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
          </a>
          <a v-if="$config.blog.enabled" class="text-gray-300 hover:text-white" href="/feed.xml" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
              <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
            </svg>
          </a>
        </div>
        <p class="mt-8 text-sm leading-6 text-gray-400 md:mt-0 md:order-1">
          {{ $config.name }} • <br/> dev template by Karn
        </p>
      </div>
    </div>
  </footer>

</template>

<script>
import CreatorPreview from 'vue-creator-preview';

export default {
  components: {
    CreatorPreview
  },
  data() {
    return {
      avatar: 'https://cdn.karngyan.com/karn.jpg',
      name: 'Karn',
      mode: 'dark',
      description: 'Software Engineer who tinkers with side projects, every now n then.',
      content: `Hey, I am Karn 👋<br/> I built this template for procrastinating devs to set up their portfolio + blogs<br/><br/>
Click on the link to visit the github repo to fork 👇🏾`,
    }
  }
}
</script>

<style scoped>
>>> .CreatorPreview {
  @apply bg-gray-900 shadow-lg !important;
}

>>> .CreatorPreview--Avatar {
  @apply h-20 w-20 !important;
}
</style>
