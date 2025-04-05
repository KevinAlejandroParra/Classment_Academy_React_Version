import { div } from "framer-motion/client";

type Props = {
    isOpen: boolean;
    onClose: ()=> void; 
    handleLogout: ()=>void;
};

const LogoutModal = ({ isOpen, onClose, handleLogout }: Props) => {
    if (!isOpen) return null;
    return(
        <div>
            <div>
                <h3>¿Estas seguro que deseas cerrar sesion?</h3>
                <div>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </div>
        </div>
    )
};