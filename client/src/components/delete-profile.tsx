type Props = {
    isOpen: boolean;
    onClose: ()=> void;
    handleDelete: () => void;
};

const DeleteProfileModal = ({ isOpen, onClose, handleDelete }: Props) => {
    if(!isOpen) return null;
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">¿Estás seguro que deseas eliminar tu perfil?</h3>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Eliminar Perfil</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProfileModal