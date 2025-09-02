import { createContext, useContext, useState, type ReactNode } from "react";

type Toast = { id: number; text: string; type?: "success" | "error" | "info" };
type Ctx = {
  show: (text: string, type?: Toast["type"]) => void;
  remove: (id: number) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<Toast[]>([]);
  const remove = (id: number) => setList((xs) => xs.filter((t) => t.id !== id));
  const show = (text: string, type: Toast["type"] = "info") => {
    const id = Date.now() + Math.random();
    setList((xs) => [...xs, { id, text, type }]);
    setTimeout(() => remove(id), 2500);
  };
  return (
    <ToastCtx.Provider value={{ show, remove }}>
      {children}
      <div className="fixed bottom-3 right-4 z-50">
        {list.map((t) => (
            <div key={t.id}
                className={`px-3 py-2 text-white 
                ${t.type === "success" ? "bg-green-600": t.type === "error" ? "bg-red-600": "bg-slate-700"}`}
            > {t.text} </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("!ctx");
  return ctx;
}