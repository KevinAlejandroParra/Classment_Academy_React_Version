type Props = {
    isOpen: boolean;
    onClose: ()=> void;
    editForm: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleEdit: (e: React.FormEvent) => void;
};

const EditProfileModal = ({ isOpen, onClose, editForm, handleInputChange, handleEdit }: Props) => {
    if (!isOpen) return null;
    return(

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleEdit} className="bg-white p-6 rounded shadow-md max-w-md w-full">
                <h3>Editar Perfil</h3>
                <input type="text" name="user_document_type" value={editForm.user_document_type} onChange={handleInputChange} placeholder="Tipo de documento" />
                <input type="text" name="user_name" value={editForm.user_name} onChange={handleInputChange} placeholder="Nombre" />
                <input type="text" name="user_lastname" value={editForm.user_lastname} onChange={handleInputChange} placeholder="Apellido" />
                <input type="text" name="user_email" value={editForm.user_email} onChange={handleInputChange} placeholder="Correo" />
                <input type="text" name="user_phone" value={editForm.user_phone} onChange={handleInputChange} placeholder="Telefono" />

                <div className="flex justify-end mt-4">
                    <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">cancelar</button>
                    <button type="submit"className="bg-blue-500 text-white px-4 py-2 rounded">Guardar Cambios</button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileModal