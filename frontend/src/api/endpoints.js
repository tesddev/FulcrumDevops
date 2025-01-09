export const endpoints = {
    auth: {
        register: "auth/register",
        login: "auth/login"
    },

    dashboard: {
        userCount: "user/get-all-users-count",
        productCount: "product/get-all-products-count"
    },

    users: {
        getAllUsers: "admin/get-all-users",
    },

    bearerToken: `Bearer ${sessionStorage.getItem("***")}`
}