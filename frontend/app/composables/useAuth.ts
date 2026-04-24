export const useAuth = () => {
  const user = useState("auth_user", () => null);
  const token = useCookie("auth_token");
  const config = useRuntimeConfig();

  const login = async (email: string, password: string) => {
    try {
      const data: any = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: { email, password },
      });
      token.value = data.access_token;
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.data?.message || "Ошибка входа" };
    }
  };

  const register = async (dto: any) => {
    try {
      const data: any = await $fetch(`${config.public.apiBase}/auth/register`, {
        method: "POST",
        body: dto,
      });
      token.value = data.access_token;
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.data?.message || "Ошибка регистрации" };
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    navigateTo("/login");
  };

  return {
    user,
    token,
    login,
    register,
    logout,
    isLoggedIn: computed(() => !!token.value),
  };
};
