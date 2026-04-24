<script setup>
const { login } = useAuth();
const form = reactive({
    email: "",
    password: "",
});
const error = ref("");

const handleSubmit = async () => {
    error.value = "";
    const res = await login(form.email, form.password);
    if (res.success) {
        navigateTo("/");
    } else {
        error.value = res.error;
    }
};
</script>

<template>
    <section>
        <h1>Авторизация</h1>
        <p>Альтернативные способы входа/создания аккаунта:</p>

        <form @submit.prevent="handleSubmit">
            <article>
                <label>Почта</label>
                <input v-model="form.email" type="email" required />
            </article>

            <article>
                <label>Пароль</label>
                <input v-model="form.password" type="password" required />
            </article>

            <button type="submit">Войти</button>
        </form>

        <p v-if="error">{{ error }}</p>

        <article>
            Ещё не создали аккаунт? -
            <NuxtLink to="/register">Зарегистрироваться</NuxtLink>
        </article>
    </section>
</template>
