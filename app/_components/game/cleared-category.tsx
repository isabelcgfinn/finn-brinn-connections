import { getWordColor, getWordTextColor } from "@/app/_utils";
import { Category } from "@/app/_types";

export default function ClearedCategory(props: { category: Category }) {
  const level = props.category.level;
  const bgColor = getWordColor(level);
  const textColor = getWordTextColor(level);

  const concatItems = props.category.items.join(", ");

  return (
    <div className={`flex flex-col items-center col-span-4 py-4 px-3 rounded-md ${bgColor}`}>
      <h1
        className={`${textColor} font-bold text-center text-balance leading-tight text-[15px] md:text-[17px]`}
      >
        {props.category.category}
      </h1>
      <h2 className={`${textColor} text-sm text-center mt-1`}>
        {concatItems}
      </h2>
    </div>
  );
}