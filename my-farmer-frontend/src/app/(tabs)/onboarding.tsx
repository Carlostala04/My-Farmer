import { useRouter } from "expo-router";
import Onboarding from "@/components/Onboarding";

/**
 * Pantalla de onboarding.
 * Solo se muestra a usuarios nuevos (redirigidos desde register.tsx).
 * Al terminar, lleva al home.
 */
export default function OnboardingScreen() {
  const router = useRouter();

  function handleDone() {
    router.replace("/(tabs)/home");
  }

  return <Onboarding onDone={handleDone} />;
}
