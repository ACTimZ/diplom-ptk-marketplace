<script setup>
import { ref, reactive, onMounted } from 'vue';
const { register } = useAuth();
const config = useRuntimeConfig();
const route = useRoute();
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

onMounted(async () => {
    const route = useRoute();
    if (route.query.token) {
        const token = useCookie("auth_token");
        const authToken = route.query.token;

        // 1. Сохраняем токен в куки
        token.value = authToken;

        // 2. Сразу же подгружаем данные пользователя, передавая токен напрямую
        const { fetchUser } = useAuth();
        await fetchUser(authToken);

        // 3. Небольшая задержка, чтобы состояние закрепилось (Nuxt иногда капризничает)
        await nextTick();

        // 4. Переходим на главную
        // Если navigateTo("/") всё равно не помогает, попробуй window.location.href = "/"
        await navigateTo("/");
    }
});
</script>

<template>
    <section>
        <h1>Регистрация</h1>
        <p>Альтернативные способы входа/создания аккаунта:</p>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-sm">
            <article>
                <label class="block">Почта</label>
                <input v-model="form.email" type="email" required class="border p-1 w-full" />
            </article>

            <article>
                <label class="block">Логин</label>
                <input v-model="form.login" type="text" required class="border p-1 w-full" />
            </article>

            <article>
                <label class="block">Имя</label>
                <input v-model="form.name" type="text" class="border p-1 w-full" />
            </article>

            <article>
                <label class="block">Пароль</label>
                <input v-model="form.password" type="password" required class="border p-1 w-full" />
            </article>

            <article>
                <label class="block">Повторите пароль</label>
                <input v-model="form.passwordConfirm" type="password" required class="border p-1 w-full" />
            </article>

            <article class="flex items-center gap-2">
                <input type="checkbox" id="policy" required />
                <label for="policy">Политика конфиденциальности</label>
            </article>

            <div class="flex gap-2">
                <button type="submit" class="bg-green-600 text-white p-2 rounded">Зарегистрироваться</button>

                <a :href="`${config.public.apiBase}/auth/yandex`"
                    class="bg-yellow-400 p-2 rounded text-black no-underline">
                    Зарегистрироваться через Яндекс
                </a>
            </div>
        </form>

        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

        <article class="mt-4">
            Уже есть аккаунт? - <NuxtLink to="/login" class="text-blue-500">Войти</NuxtLink>
        </article>
    </section>
</template>