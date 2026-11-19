import BridgeDinamico from "../components/BridgeDinamico";
import { BRIDGE_CONFIG } from "../config/bridge.config";

// La propuesta dinámica es ahora la página principal oficial
export default function Page() {
  return <BridgeDinamico config={BRIDGE_CONFIG} />;
}
