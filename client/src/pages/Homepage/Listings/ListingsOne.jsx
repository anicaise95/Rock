import { NavLink, useParams } from "react-router-dom";

export default function ListingsOne() {

    const { id } = useParams();
    console.log('Identifiant du bien immobilier : ' + id);

    return (
        <div className="card">
            Bien immobilier n°1
        </div>
        
    );
}