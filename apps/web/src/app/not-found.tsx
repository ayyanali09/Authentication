import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-32">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase text-yellow-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white-text">
          This page is not available.
        </h1>
        <p className="mt-4 text-white/62">
          Head back to the main site and keep exploring our development services.
        </p>
        <LinkButton href="/" className="mt-7">
          Back home
        </LinkButton>
      </div>
    </div>
  );
}
