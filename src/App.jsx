import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Module1 from "./modules/Module1_Introduction";
import Module3 from "./modules/Module3_ContractAdministrator";
import Module6 from "./modules/Module6_Payment";
import PaymentAssistant from "./modules/PaymentAssistant";
import Sim1 from "./simulators/Sim1_ContractSelection";
import Sim3 from "./simulators/Sim3_ContractAdministrator";
import Sim6 from "./simulators/Sim6_Payment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/module/1" element={<Module1 />} />
        <Route path="/module/3" element={<Module3 />} />
        <Route path="/module/6" element={<Module6 />} />
        <Route path="/simulator/1" element={<Sim1 />} />
        <Route path="/simulator/3" element={<Sim3 />} />
        <Route path="/simulator/6" element={<Sim6 />} />
        <Route path="/assistant/payment" element={<PaymentAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}
