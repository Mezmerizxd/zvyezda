export const NumberWidget = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex p-2 bg-background-dark rounded-lg divide-x divide-white/20">
      <div className="w-2/12 p-2 min-h-max flex justify-center items-center text-radiance-light text-6xl">{number}</div>
      <div className="w-10/12 p-2 divide-y divide-white/20">
        <h2 className="text-2xl text-white-light">{title}</h2>
        <p className="mt-1 pt-2 text-white-dark break-words">{description}</p>
      </div>
    </div>
  );
};
