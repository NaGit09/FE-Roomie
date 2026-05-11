import CustomerHeader from "@/components/custom/customer/header";
import CustomerFooter from "@/components/custom/customer/footer";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
}
