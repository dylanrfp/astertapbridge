import BridgeDinamico from "../../components/BridgeDinamico";
import { BRIDGE_CONFIG } from "../../config/bridge.config";

// Vista previa del Bridge dinámico (propuesta v2). No se indexa en Google.
export const metadata = {
  title: `Propuesta · Bridge dinámico · ${BRIDGE_CONFIG.brandName}`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/propuesta" },
};

export default function PropuestaPage() {
  return <BridgeDinamico config={BRIDGE_CONFIG} />;
}
