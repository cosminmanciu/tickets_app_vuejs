// router.js
import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Login from './components/AdminLogin.vue';
import Dashboard from './components/UserDashboard.vue';
import ManageEvents from './components/ManageEvents.vue';
import ManageTickets from './components/ManageTickets.vue';
import ManageOrganizers from './components/ManageOrganizers.vue';
import RegisterAdmin from "@/components/RegisterAdmin.vue";

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        { path: '/login', component: Login },
        {
            path: '/register',
            component: RegisterAdmin,
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/manage-events',
            component: ManageEvents,
            meta: { requiresAuth: true }
        },
        {
            path: '/manage-tickets',
            component: ManageTickets,
            meta: { requiresAuth: true }
        },
        {
            path: '/manage-organizers',
            component: ManageOrganizers,
            meta: { requiresAuth: true }
        },
        { path: '*', redirect: '/login' }
    ]
});


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {
            next('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
