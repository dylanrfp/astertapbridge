import Bridge from "../components/Bridge";
import { BRIDGE_CONFIG } from "../config/bridge.config";

export default function Page() {
  return <Bridge config={BRIDGE_CONFIG} />;
}
