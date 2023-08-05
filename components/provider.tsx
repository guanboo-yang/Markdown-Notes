import { ConfigProvider } from "@/hooks/useConfig";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <ConfigProvider>{children}</ConfigProvider>;
};

export default Provider;
