import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";

export function PwaRegistrar() {
  useEffect(() => {
    registerSW({ immediate: true });
  }, []);

  return null;
}
