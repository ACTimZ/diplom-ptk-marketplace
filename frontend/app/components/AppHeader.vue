<script setup>
const { isLoggedIn, logout } = useAuth();
</script>

<template>
    <header>
        <nav>
            <NuxtLink to="/">Главная</NuxtLink>

            <article v-if="!isLoggedIn">
                <NuxtLink to="/login">Войти</NuxtLink>
            </article>

            <article v-else>
                <span>Вы авторизованы</span>
                <button @click="logout">Выйти</button>
            </article>
        </nav>
    </header>
</template>
