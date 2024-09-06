import { LuAlertOctagon } from "react-icons/lu";

export default function NotFoundPage() {
  return (
    <div className="h-dvh w-dvw bg-custom-background text-custom-text-colour flex overflow-hidden">
      <div className="w-full flex flex-col justify-center items-center gap-5">
        <div className="flex justify-center items-end gap-2 text-red-500">
          <h2 className="text-5xl font-bold font-sans">404</h2>
          <LuAlertOctagon size={40} />
        </div>
        <p className="text-xl font-semibold">
          The Route Requested Does Not Exist
        </p>
      </div>
    </div>
  );
}
