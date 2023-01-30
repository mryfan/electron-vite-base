import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ImagesView from "../views/docker/ImagesView.vue";
import ProjectView from "../views/docker/ProjectView.vue";
import DockerFileView from "../views/docker/DockerFileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/workbench",
      name: "workbench",
      component: HomeView,
    },
    {
      path: "/docker",
      name: "docker",
      children: [
        {
          path: "docker-file",
          name: "docker/docker-file",
          component: DockerFileView,
        },
        {
          path: "docker-images",
          name: "docker/docker-images",
          component: ImagesView,
        },
        {
          path: "docker-project",
          name: "docker/docker-project",
          component: ProjectView,
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
