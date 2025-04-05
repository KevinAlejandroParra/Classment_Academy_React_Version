import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ProfileItemProps = {
    icon: any;
    value: string;
    label: string;
};

const ProfileItem = ({ icon, label, value }: ProfileItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className="text-2xl" />
      <div className="flex flex-col">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

export default ProfileItem;