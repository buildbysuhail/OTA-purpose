interface ERPCardProps {
  children: React.ReactNode;
  sizeAuto?: boolean;
  className?: string;
}

const ERPCard = (props: ERPCardProps) => {
  return (
    <div
      className={`${
        props.sizeAuto ? '' : 'w-full h-full'
      } flex flex-col dark:bg-body_dark bg-white border-1 border-body_border dark:border-body_border_dark rounded-md ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default ERPCard;
