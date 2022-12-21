import { useRoute, useRouter } from "vue-router";

export function RouteOperation() {
  const route = useRoute();
  const router = useRouter();
  if (route.path == "/") {
    router.push("/workbench");
  }
}
