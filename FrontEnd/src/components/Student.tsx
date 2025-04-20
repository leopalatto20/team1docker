import deleteIcon from "./../assets/delete.png";

interface Props {
  listNum: number;
  group: string;
  gender: string;
  onDeleteButton: () => void;
}

//Tarjetas que se usan para mostrar a los alumnos y hacerlos eliminables
export default function Student({ listNum, group, gender, onDeleteButton }: Props) {
  return (
    <div className="grid grid-cols-4 items-center p-4 rounded-lg shadow bg-white text-sm">
      <div className="text-center">{listNum}</div>
      <div className="text-center">{group}</div>
      <div className="text-center">{gender}</div>
      <div className="flex justify-center">
        <img src={deleteIcon} onClick={onDeleteButton} className="hover:scale-125 md:h-1/4 md:w-1/4 h-1/2 w-1/2 cursor-pointer duration-200" />
      </div>
    </div>
  );
}
