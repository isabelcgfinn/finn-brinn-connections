type StatusLineProps = {
  /** When set, replaces the subtitle until the popup timer clears it. */
  message: string | null;
};

/**
 * The line under the title. Normally the "Create four groups of four!"
 * subtitle; while a game message is showing ("One away...", "You've already
 * guessed that!", the win/lose message) the message takes its place, so it
 * appears exactly where the player is already looking.
 *
 * The row has a fixed minimum height so swapping between the two never
 * nudges the grid. aria-live announces each message to screen readers.
 */
export default function StatusLine({ message }: StatusLineProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 mb-4 min-h-[2.5rem]"
      aria-live="polite"
    >
      {message ? (
        <p className="pair-cream rounded-full px-5 py-1.5 font-condensed font-bold uppercase tracking-wide text-lg text-center">
          {message}
        </p>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/daffodil-white.png"
            alt=""
            aria-hidden="true"
            className="w-6 h-6 shrink-0"
          />
          <h2 className="text-wedding-cream font-condensed uppercase tracking-wide text-lg">
            Create four groups of four!
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/daffodil-white.png"
            alt=""
            aria-hidden="true"
            className="w-6 h-6 shrink-0"
          />
        </>
      )}
    </div>
  );
}
