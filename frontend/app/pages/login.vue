<script setup>
import { ref, reactive, onMounted } from 'vue';

const { login } = useAuth();
const config = useRuntimeConfig();
const route = useRoute();

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

onMounted(async () => {
    const route = useRoute();
    if (route.query.token) {
        const token = useCookie("auth_token");
        const authToken = route.query.token;

        token.value = authToken;

        const { fetchUser } = useAuth();
        await fetchUser(authToken);

        await nextTick();

        await navigateTo("/");
    }
});
</script>

<template>
    <section>
        <h1>Авторизация</h1>
        <p>Альтернативные способы входа/создания аккаунта:</p>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-sm">
            <article>
                <label class="block">Почта</label>
                <input v-model="form.email" type="email" required class="border p-1 w-full" />
            </article>

            <article>
                <label class="block">Пароль</label>
                <input v-model="form.password" type="password" required class="border p-1 w-full" />
            </article>

            <div class="flex gap-2">
                <button type="submit" class="bg-blue-500 text-white p-2 rounded">Войти</button>

                <a :href="`${config.public.apiBase}/auth/yandex`"
                    class="bg-yellow-400 p-2 rounded text-black no-underline">
                    Войти через Яндекс
                </a>
            </div>
        </form>

        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

        <article class="mt-4">
            Ещё не создали аккаунт? -
            <NuxtLink to="/register" class="text-blue-500">Зарегистрироваться</NuxtLink>
        </article>
    </section>
</template>