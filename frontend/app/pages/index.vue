<script setup>
const { user, isLoggedIn, fetchUser } = useAuth();

onMounted(() => {
    // Если мы вошли, но данных почему-то нет (тот самый случай)
    if (isLoggedIn.value && !user.value) {
        fetchUser();
    }
});
</script>

<template>
    <section class="p-8">
        <div v-if="isLoggedIn"
            class="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
            Вы находитесь на странице каталога
        </div>

        <h1 class="text-4xl font-black mb-8">Каталог товаров и услуг</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="i in 8" :key="i" class="h-64 bg-gray-100 animate-pulse rounded-2xl"></div>
        </div>
    </section>
</template>