import { createRoot } from "react-dom/client";
import "./index.css";
import { getMissingPublicEnvVars } from "@/config/runtimeEnv";

// Initialize i18n
import "./lib/i18n";

const missingPublicEnvVars = getMissingPublicEnvVars();

function removeInitialLoader() {
  const loader = document.getElementById("initial-loader");
  if (!loader) return;

  loader.style.transition = "opacity 0.2s ease";
  loader.style.opacity = "0";
  window.setTimeout(() => loader.remove(), 200);
}

function ConfigurationErrorScreen({
  missingEnvVars,
}: {
  missingEnvVars: string[];
}) {
  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-black/35 p-8 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            Deployment Configuration Error
          </p>
          <h1 className="mt-4 text-4xl font-bold">
            Required public environment variables are missing.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80">
            This build started, but the app cannot connect to its public services yet.
            Add the variables below in your local <code>.env</code> file and in your hosting
            provider settings, then redeploy.
          </p>
          <div className="mt-8 rounded-2xl border border-primary/30 bg-white/5 p-5">
            <p className="text-sm font-medium text-white/70">Missing variables</p>
            <ul className="mt-3 space-y-2 text-left">
              {missingEnvVars.map((envVar) => (
                <li key={envVar} className="font-mono text-sm text-primary">
                  {envVar}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-sm text-white/60">
            For Netlify, add them under Site configuration, Environment variables, and trigger a new deploy.
          </p>
        </div>
      </div>
    </div>
  );
}

async function bootstrap() {
  const root = createRoot(document.getElementById("root")!);

  if (missingPublicEnvVars.length > 0) {
    root.render(<ConfigurationErrorScreen missingEnvVars={missingPublicEnvVars} />);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(removeInitialLoader);
    });
    return;
  }

  const { default: App } = await import("./App.tsx");
  root.render(<App />);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(removeInitialLoader);
  });
}

void bootstrap();
