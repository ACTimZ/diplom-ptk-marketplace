<script setup>
const { fetchUser } = useAuth();
onMounted(() => {
    fetchUser();
});
</script>

<template>
    <main>
        <AppHeader />
        <NuxtPage />
    </main>
</template>