export default function ControlButton(props: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
  className?: string;
}) {
  // Unavailable buttons stay visible in the brand yellow, just faded, so the
  // player can see what will become possible. (Turning them aubergine made
  // them vanish into the aubergine page.)
  const stateClasses = props.unclickable
    ? "text-wedding-yellow/40 border-wedding-yellow/40 cursor-not-allowed"
    : `text-wedding-yellow border-wedding-yellow
       hover:bg-wedding-yellow hover:text-wedding-aubergine`;

  return (
    <button
      type="button"
      disabled={props.unclickable}
      className={`
        border rounded-full font-medium py-3 px-4 text-l
        transition-colors duration-200
        ${stateClasses}
        ${props.className ?? ""}
      `}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
