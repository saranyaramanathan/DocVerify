import { Toaster } from "../src/ui/toaster";
import { Toaster as Sonner } from "../src/ui/sonner";
import { TooltipProvider } from "../src/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PANSearch from "./pages/PANSearch";
import GSTSearch from "./pages/GSTSearch";
import GSTByPAN from "./pages/GSTByPAN";
import BankStatement from "./pages/BankStatement";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Helmet>
                <meta charSet="utf-8" />
                <title>DocVerify-GST & PAN Verification Portal </title>
               
            </Helmet>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<GSTSearch />} />
            <Route path="gst-search" element={<GSTSearch />} />
            <Route path="pan-search" element={<PANSearch />} />
            <Route path="gst-by-pan" element={<GSTByPAN />} />
            <Route path="bank-statement" element={<BankStatement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
