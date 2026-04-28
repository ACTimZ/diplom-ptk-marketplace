<script setup>
const { user, isLoggedIn, logout } = useAuth();

const userAvatar = computed(() => {
    return user.value?.avatarUrl || '/img/avatar.png';
});
</script>

<template>
    <header class="bg-white shadow-sm border-b sticky top-0 z-40">
        <nav class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <NuxtLink to="/" class="text-xl font-black text-blue-600 tracking-tighter">
                    PIXEL<span class="text-gray-900">MARKET</span>
                </NuxtLink>
                <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 transition font-medium">
                    Каталог
                </NuxtLink>
            </div>

            <div class="flex items-center gap-4">
                <template v-if="!isLoggedIn">
                    <NuxtLink to="/login" class="text-gray-700 hover:text-blue-600 font-medium px-4 py-2">
                        Войти
                    </NuxtLink>
                    <NuxtLink to="/register"
                        class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                        Регистрация
                    </NuxtLink>
                </template>

                <template v-else>
                    <NuxtLink to="/profile"
                        class="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 rounded-full transition border border-transparent hover:border-gray-200">
                        <img :src="userAvatar" class="w-8 h-8 rounded-full border shadow-sm object-cover"
                            alt="User Avatar" />
                        <div class="hidden sm:block text-left">
                            <p class="text-sm font-bold leading-none text-gray-900">
                                {{ user?.name || 'Мой профиль' }}
                            </p>
                            <p class="text-[10px] text-gray-500 leading-none mt-1">
                                {{ user?.balance || 0 }} ₽
                            </p>
                        </div>
                    </NuxtLink>

                    <button @click="logout" class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Выйти">
                        <p>Выйти</p>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </template>
            </div>
        </nav>
    </header>
</template>