export default function ControlButton(props: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
  className?: string;
}) {
  const click = props.unclickable ? "pointer-events-none" : "";

  // TEXT colour
  const textColor = props.unclickable
    ? "text-wedding-aubergine"
    : "text-wedding-gold";

  // BORDER colour
  const borderColor = props.unclickable
    ? "border-wedding-aubergine"
    : "border-wedding-gold";

  return (
    <button
      className={`
        ${borderColor}
        border
        rounded-full
        ${textColor}
        font-medium
        py-3
        px-4
        text-l
        transition-colors duration-200
        ${!props.unclickable ? `
          hover:bg-wedding-gold
          hover:text-wedding-redDeep
          hover:border-wedding-gold
        ` : ""}
        ${click}
        ${props.className ?? ""}
      `}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}