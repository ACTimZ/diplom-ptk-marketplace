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
        <h1 class="text-2xl font-bold mb-4">Добро пожаловать в Pixel Marketplace</h1>

        <article v-if="isLoggedIn && user" class="bg-white shadow rounded-lg p-6 max-w-md">
            <div class="flex items-center gap-4 mb-4">
                <img v-if="user.avatarUrl" :src="user.avatarUrl" class="w-16 h-16 rounded-full border" alt="Avatar" />
                <div>
                    <h2 class="text-xl font-semibold">{{ user.name }}</h2>
                    <p class="text-gray-500">@{{ user.login }}</p>
                </div>
            </div>

            <div class="space-y-2 border-t pt-4">
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p v-if="user.phone"><strong>Телефон:</strong> {{ user.phone }}</p>
                <p v-if="user.birthday"><strong>День рождения:</strong> {{ user.birthday }}</p>
                <p><strong>Баланс:</strong> {{ user.balance }} ₽</p>
                <p class="text-xs text-gray-400 mt-4">ID в системе: {{ user.id }}</p>
            </div>
        </article>

        <article v-else-if="isLoggedIn && !user">
            <p>Загрузка данных профиля...</p>
        </article>

        <article v-else>
            <p>Пожалуйста, войдите, чтобы увидеть свой профиль.</p>
            <NuxtLink to="/login" class="text-blue-500 underline">Перейти к логину</NuxtLink>
        </article>
    </section>
</template>