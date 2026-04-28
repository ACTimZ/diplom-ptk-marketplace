<script setup>
const { user, fetchUser, token } = useAuth();
const config = useRuntimeConfig();

const isModalOpen = ref(false);
const editDescription = ref("");

// Состояния для новых данных
const newLogin = ref("");
const newPassword = ref("");
const showPassword = ref(false); // Состояние видимости пароля
const statusMsg = ref({ text: "", isError: false });

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

// Универсальная функция обновления профиля
const updateProfile = async (body) => {
    statusMsg.value = { text: "", isError: false };
    try {
        await $fetch(`${config.public.apiBase}/users/me`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token.value}` },
            body
        });
        await fetchUser();
        return true;
    } catch (e) {
        statusMsg.value = {
            text: e.data?.message || "Ошибка при обновлении данных",
            isError: true
        };
        return false;
    }
};

const openEdit = () => {
    editDescription.value = user.value.description || "";
    isModalOpen.value = true;
};

const saveDescription = async () => {
    if (await updateProfile({ description: editDescription.value })) {
        isModalOpen.value = false;
    }
};

const handleUpdateLogin = async () => {
    if (!newLogin.value || newLogin.value.length < 3) {
        alert("Логин слишком короткий");
        return;
    }
    await updateProfile({ login: newLogin.value });
};

const handleSetPassword = async () => {
    if (!newPassword.value || newPassword.value.length < 8) {
        alert("Пароль должен быть не менее 8 символов");
        return;
    }
    if (await updateProfile({ password: newPassword.value })) {
        newPassword.value = ""; // Очищаем поле после успеха
        alert("Пароль успешно установлен!");
    }
};

const yandexLink = computed(() => `${config.public.apiBase}/auth/yandex`);
const userAvatar = computed(() => user.value?.avatarUrl || '/img/avatar.png');

// Проверка: системный ли логин (начинается на id или user_)
const isSystemLogin = computed(() => {
    return user.value?.login.startsWith('id') || user.value?.login.startsWith('user_');
});
</script>

<template>
    <div class="p-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Личный кабинет</h1>

        <div v-if="user" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-6">
                <div class="bg-white p-6 shadow rounded-xl text-center">
                    <img :src="userAvatar"
                        class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-50 object-cover" />
                    <h2 class="font-bold text-xl">{{ user.name || 'Пользователь' }}</h2>
                    <p class="text-gray-500 mb-4 font-mono text-sm">@{{ user.login }}</p>

                    <div v-if="!user.yandexId" class="mt-4">
                        <a :href="yandexLink"
                            class="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium transition block text-center">
                            Привязать Яндекс ID
                        </a>
                    </div>
                    <div v-else class="mt-4 text-green-600 flex items-center justify-center gap-1 text-sm font-medium">
                        <span>✓ Привязано к Яндекс</span>
                    </div>
                </div>

                <div v-if="isSystemLogin" class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                    <p class="text-yellow-800 font-bold text-sm mb-2">Уникальный логин</p>
                    <p class="text-xs text-yellow-700 mb-3">Сейчас у вас временный логин. Измените его на постоянный
                        (только один раз).</p>
                    <input v-model="newLogin" type="text" placeholder="Новый логин..."
                        class="w-full border border-yellow-300 p-2 rounded-lg text-sm mb-2 outline-none focus:ring-2 focus:ring-yellow-400" />
                    <button @click="handleUpdateLogin"
                        class="w-full bg-yellow-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-yellow-600 transition shadow-sm">
                        Установить логин
                    </button>
                </div>
            </div>

            <div class="md:col-span-2 space-y-6">
                <div class="bg-white p-6 shadow rounded-xl">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-lg">О себе</h3>
                        <button @click="openEdit" class="text-blue-600 text-sm hover:underline">Редактировать</button>
                    </div>
                    <p class="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {{ user.description || 'Расскажите о своей деятельности на маркетплейсе...' }}
                    </p>
                </div>

                <div class="bg-white p-6 shadow rounded-xl border border-transparent">
                    <h3 class="font-bold text-lg mb-4">Безопасность</h3>

                    <div v-if="!user.passwordHash" class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                        <p class="text-sm text-blue-700 mb-3 font-medium">
                            У вас не установлен пароль. Добавьте его, чтобы входить по почте без использования Яндекса.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <div class="relative flex-1">
                                <input 
                                    v-model="newPassword" 
                                    :type="showPassword ? 'text' : 'password'" 
                                    placeholder="Придумайте пароль"
                                    class="w-full border p-2 pr-10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 transition" 
                                />
                                <button 
                                    @click="togglePassword" 
                                    type="button"
                                    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition p-1"
                                >
                                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            <button @click="handleSetPassword"
                                class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition">
                                Установить
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div class="text-gray-500 font-medium">Email:</div>
                        <div class="font-semibold text-gray-800">{{ user.email }}</div>
                        <div class="text-gray-500 font-medium">Пароль:</div>
                        <div class="font-mono text-gray-800">{{ user.passwordHash ? '••••••••' : 'Не установлен' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="fade">
            <div v-if="isModalOpen"
                class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                    <h3 class="text-xl font-bold mb-4 text-gray-900">Деятельность на сайте</h3>
                    <textarea v-model="editDescription" rows="6"
                        class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
                        placeholder="Например: Разрабатываю ботов и продаю софт..."></textarea>
                    <div class="flex justify-end gap-3 mt-4">
                        <button @click="isModalOpen = false"
                            class="px-4 py-2 text-gray-400 hover:text-gray-600 font-medium transition">Отмена</button>
                        <button @click="saveDescription"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">Сохранить</button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>