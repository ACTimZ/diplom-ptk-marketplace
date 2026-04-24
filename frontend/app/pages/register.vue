<script setup>
const { register } = useAuth();
const form = reactive({
    email: "",
    login: "",
    name: "",
    password: "",
    passwordConfirm: "",
});
const error = ref("");

const handleSubmit = async () => {
    if (form.password !== form.passwordConfirm) {
        return (error.value = "Пароли не совпадают");
    }
    error.value = "";
    const res = await register(form);
    if (res.success) {
        navigateTo("/");
    } else {
        error.value = res.error;
    }
};
</script>

<template>
    <section>
        <h1>Регистрация</h1>
        <p>Альтернативные способы входа/создания аккаунта:</p>

        <form @submit.prevent="handleSubmit">
            <article>
                <label>Почта</label>
                <input v-model="form.email" type="email" required />
            </article>

            <article>
                <label>Логин</label>
                <input v-model="form.login" type="text" required />
            </article>

            <article>
                <label>Имя</label>
                <input v-model="form.name" type="text" />
            </article>

            <article>
                <label>Пароль</label>
                <input v-model="form.password" type="password" required />
            </article>

            <article>
                <input
                    v-model="form.passwordConfirm"
                    type="password"
                    placeholder="Повторите пароль"
                    required
                />
            </article>

            <article>
                <input type="checkbox" id="policy" required />
                <label for="policy">- Политика конфиденциальности</label>
            </article>

            <button type="submit">Зарегистрироваться</button>
        </form>

        <p v-if="error">{{ error }}</p>

        <article>
            Уже есть аккаунт? - <NuxtLink to="/login">Войти</NuxtLink>
        </article>
    </section>
</template>
